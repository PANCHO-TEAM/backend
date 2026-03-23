import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.mail.ru';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

console.log('Email config:', { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS: SMTP_PASS ? '***' : undefined, FROM_EMAIL });

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOrderNotification = async (order) => {
  const subject = `Новый заказ #${order.id}`;
    console.log('test')

  const html = `
    <h2>Новый заказ на сайте Cats on Cakes</h2>
    <p><strong>ID заказа:</strong> ${order.id}</p>
    <p><strong>Клиент:</strong> ${order.name}</p>
    <p><strong>Тип связи:</strong> ${order.contactType}</p>
    <p><strong>Контакты:</strong> ${order.contactValue}</p>
    <p><strong>Сообщение:</strong> ${order.message}</p>
    <p><strong>Дата создания:</strong> ${new Date(order.createdAt).toLocaleString('ru-RU')}</p>
  `;

  const to = process.env.ADMIN_MAIL;

  const info = await transporter.sendMail({
    from: `"Cats on Cakes" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
  return info;
};

export const sendOrderConfirmation = async (order, customerEmail, product) => {
  const subject = `Ваш заказ #${order.id} принят`;
  
  const html = `
    <h2>Спасибо за ваш заказ, ${order.name}!</h2>
    <p>Ваш заказ #${order.id} успешно оформлен.</p>
    <p><strong>Ваше сообщение:</strong> ${order.message}</p>
    ${product ? `<p><strong>Товар:</strong> ${product.name}</p>` : ''}
    <p>Мы свяжемся с вами по указанному контакту: ${order.contactValue}</p>
    <p>С уважением, команда Cats on Cakes</p>
  `;

  const info = await transporter.sendMail({
    from: `"Cats on Cakes" <${FROM_EMAIL}>`,
    to: customerEmail,
    subject,
    html,
  });

  return info;
};

