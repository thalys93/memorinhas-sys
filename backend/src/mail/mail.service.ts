import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { appConfig } from 'src/config/app.config';
import { FulfillmentMode } from 'src/enums/FulfillmentMode';

type TemplateVars = Record<string, string | number>;

export type OrderMailItem = {
    name: string;
    quantity: number;
    unitValue: number;
};

export type OrderMailPayload = {
    to: string;
    storeName: string;
    customerName: string;
    orderId: string;
    items: OrderMailItem[];
    subtotal: number;
    freightAmount: number;
    total: number;
    paymentMethod: string;
    cep: string;
};

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    private async getTransporter() {
        const driver = String(process.env.MAIL_DRIVER || 'smtp').toLowerCase();

        if (driver === 'ethereal') {
            const testAccount = await nodemailer.createTestAccount();
            this.logger.log(`Usando driver Ethereal: ${testAccount.user}`);
            return nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
        }

        if (driver === 'console') {
            this.logger.log(
                'Usando driver Console (sem envio, apenas imprime).',
            );
            return nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true,
            });
        }

        const host = process.env.MAIL_HOST;
        const port = Number(process.env.MAIL_PORT || 587);
        const secure = String(process.env.MAIL_SECURE || 'false') === 'true';
        const user = process.env.MAIL_USER;
        const pass = process.env.MAIL_PASS;

        if (!host || !user || !pass) {
            this.logger.error('MAIL_HOST/MAIL_USER/MAIL_PASS não configurados');
            throw new Error('Configuração de SMTP ausente');
        }

        this.logger.log(`Usando driver SMTP: ${host}:${port} secure=${secure}`);
        return nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
        });
    }

    private resolveTemplatePath(templateName: string): string {
        const candidates = [
            path.join(__dirname, 'templates', templateName),
            path.join(process.cwd(), 'src', 'mail', 'templates', templateName),
        ];

        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }

        return '';
    }

    private applyVars(raw: string, variables: TemplateVars): string {
        let out = raw.replace(
            /{{#if\s+(\w+)}}([\s\S]*?){{\/?if}}/g,
            (_, key, inner) => {
                const v = variables[key];
                return v ? inner : '';
            },
        );
        out = out.replace(/{{\s*(\w+)\s*}}/g, (_, key) =>
            String(variables[key] ?? ''),
        );
        return out;
    }

    private renderTemplate(
        templateName: string,
        variables: TemplateVars,
    ): string {
        const templatePath = this.resolveTemplatePath(templateName);

        if (!templatePath) {
            this.logger.warn(
                `Template ${templateName} não encontrado, usando fallback inline.`,
            );
            return `<!doctype html><html><body>
                <h2>${appConfig.name}</h2>
                <p>${String(variables.message ?? variables.code ?? '')}</p>
            </body></html>`;
        }

        return this.applyVars(fs.readFileSync(templatePath, 'utf8'), variables);
    }

    private renderWithLayout(
        contentTemplate: string,
        variables: TemplateVars,
        pageTitle = '',
    ): string {
        const body = this.renderTemplate(contentTemplate, variables);
        return this.renderTemplate('layout.hbs', {
            appName: appConfig.name,
            pageTitle,
            logoUrl: appConfig.logoUrl,
            body,
        });
    }

    private formatMoney(value: number): string {
        return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
    }

    private buildItemsHtml(items: OrderMailItem[]): string {
        const rows = items
            .map((item) => {
                const lineTotal = this.formatMoney(
                    item.unitValue * item.quantity,
                );
                return `<tr>
            <td style="padding:10px 0;font-size:15px;color:#1d1d1f;border-bottom:1px solid #d2d2d7;">${item.quantity}× ${item.name}</td>
            <td style="padding:10px 0;font-size:15px;color:#1d1d1f;text-align:right;border-bottom:1px solid #d2d2d7;">${lineTotal}</td>
          </tr>`;
            })
            .join('');

        return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${rows}</table>`;
    }

    private orderBaseVars(payload: OrderMailPayload): TemplateVars {
        return {
            storeName: payload.storeName,
            customerName: payload.customerName,
            orderId: payload.orderId.slice(0, 8),
            itemsHtml: this.buildItemsHtml(payload.items),
            subtotal: this.formatMoney(payload.subtotal),
            freight: this.formatMoney(payload.freightAmount),
            total: this.formatMoney(payload.total),
            paymentMethod: payload.paymentMethod,
            cep: payload.cep,
        };
    }

    async sendMail(to: string, subject: string, html: string) {
        const driver = String(process.env.MAIL_DRIVER || 'smtp').toLowerCase();
        const from =
            process.env.MAIL_FROM ||
            process.env.MAIL_USER ||
            'no-reply@localhost';

        const logInfo = (info: nodemailer.SentMessageInfo, drv: string) => {
            if (drv === 'ethereal') {
                const url = nodemailer.getTestMessageUrl(info);
                this.logger.log(
                    `Email (Ethereal) enviado para ${to} — preview: ${url}`,
                );
            } else if (drv === 'console') {
                const raw = info.message?.toString?.() || '';
                this.logger.log(
                    `Email (Console) para ${to} — assunto: ${subject}\n${raw}`,
                );
            } else {
                this.logger.log(
                    `Email enviado para ${to} — assunto: ${subject}`,
                );
            }
        };

        try {
            const transporter = await this.getTransporter();
            const info = await transporter.sendMail({
                from,
                to,
                subject,
                html,
            });
            logInfo(info, driver);
        } catch (err: unknown) {
            const error = err as { message?: string; code?: string };
            const msg = error?.message || String(err);
            const code = error?.code;
            this.logger.error(
                `Falha ao enviar email (driver=${driver}): ${msg}`,
            );
            const recoverable =
                code === 'EAUTH' ||
                code === 'ETIMEDOUT' ||
                code === 'ECONNRESET' ||
                /Unexpected socket close/i.test(msg);

            if (!recoverable || driver === 'console') {
                throw err;
            }

            this.logger.warn(
                'Aplicando fallback para driver console (apenas imprime no terminal).',
            );
            const consoleTransporter = nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true,
            });
            const info = await consoleTransporter.sendMail({
                from,
                to,
                subject,
                html,
            });
            logInfo(info, 'console');
        }
    }

    async sendPasswordResetMail(email: string, code: string) {
        const subject = `${appConfig.name} — Recuperação de senha`;
        const html = this.renderWithLayout(
            'password-reset.hbs',
            { code },
            'Recuperação de senha',
        );
        await this.sendMail(email, subject, html);
    }

    async sendWelcomeMail(to: string, password: string) {
        const html = this.renderWithLayout(
            'welcome-user.hbs',
            {
                email: to,
                password,
                loginUrl: appConfig.frontendUrl,
            },
            'Boas-vindas',
        );
        await this.sendMail(to, `Bem-vindo(a) ao ${appConfig.name}`, html);
    }

    async sendNotificationMail(to: string, title: string, message: string) {
        const html = this.renderWithLayout(
            'notification.hbs',
            { title, message },
            title,
        );
        await this.sendMail(to, title, html);
    }

    async sendOrderUpdateMail(
        payload: OrderMailPayload,
        statusLabel: string,
        customMessage?: string,
    ) {
        const trimmed = customMessage?.trim() ?? '';
        const html = this.renderWithLayout(
            'order-update.hbs',
            {
                ...this.orderBaseVars(payload),
                statusLabel,
                customMessage: trimmed,
                isDefault: trimmed ? '' : '1',
            },
            'Atualização do pedido',
        );
        await this.sendMail(
            payload.to,
            `Atualização do pedido #${payload.orderId.slice(0, 8)} — ${payload.storeName}`,
            html,
        );
    }

    async sendOrderCreatedMail(payload: OrderMailPayload) {
        const html = this.renderWithLayout(
            'order-created.hbs',
            this.orderBaseVars(payload),
            'Pedido confirmado',
        );
        await this.sendMail(
            payload.to,
            `Pedido confirmado #${payload.orderId.slice(0, 8)} — ${payload.storeName}`,
            html,
        );
    }

    async sendOrderFulfillmentMail(
        payload: OrderMailPayload,
        mode: FulfillmentMode,
    ) {
        const isDelivery = mode === FulfillmentMode.Delivery ? '1' : '';
        const isPickup = mode === FulfillmentMode.Pickup ? '1' : '';
        const pageTitle =
            mode === FulfillmentMode.Delivery
                ? 'Pedido enviado'
                : 'Pronto para retirada';
        const html = this.renderWithLayout(
            'order-fulfillment.hbs',
            {
                ...this.orderBaseVars(payload),
                isDelivery,
                isPickup,
            },
            pageTitle,
        );
        await this.sendMail(
            payload.to,
            `${pageTitle} #${payload.orderId.slice(0, 8)} — ${payload.storeName}`,
            html,
        );
    }

    async sendOrderCompletedMail(payload: OrderMailPayload) {
        const html = this.renderWithLayout(
            'order-completed.hbs',
            this.orderBaseVars(payload),
            'Pedido finalizado',
        );
        await this.sendMail(
            payload.to,
            `Pedido finalizado #${payload.orderId.slice(0, 8)} — ${payload.storeName}`,
            html,
        );
    }
}
