import nodemailer from 'nodemailer';
import dotenv from "dotenv";

// Загружаем SMTP-настройки из файла окружения.
dotenv.config();

// Собираем параметры почтового сервера и адрес отправителя.
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.mail.ru';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

// Логируем конфигурацию без пароля, чтобы было проще диагностировать проблемы с почтой.
console.log('Email config:', { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS: SMTP_PASS ? '***' : undefined, FROM_EMAIL });

// Создаем SMTP-транспорт, через который отправляются все письма приложения.
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

// Формируем и отправляем письмо администратору при появлении нового заказа.
export const sendOrderNotification = async (order) => {
  const subject = `Новый заказ #${order.id}`;
  // В HTML-письме передаем основные данные заказа и клиента.
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

  // Отправляем письмо на почту администратора магазина.
  const info = await transporter.sendMail({
    from: `"Cats on Cakes" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
  return info;
};

// Формируем письмо-подтверждение для клиента после оформления заказа.
export const sendOrderConfirmation = async (order, customerEmail, product) => {
  const subject = `Р’Р°С€ Р·Р°РєР°Р· #${order.id} РїСЂРёРЅСЏС‚`;
  
  // Если заказ связан с товаром, добавляем его в текст письма.
  const html = `
    <h2>РЎРїР°СЃРёР±Рѕ Р·Р° РІР°С€ Р·Р°РєР°Р·, ${order.name}!</h2>
    <p>Р’Р°С€ Р·Р°РєР°Р· #${order.id} СѓСЃРїРµС€РЅРѕ РѕС„РѕСЂРјР»РµРЅ.</p>
    <p><strong>Р’Р°С€Рµ СЃРѕРѕР±С‰РµРЅРёРµ:</strong> ${order.message}</p>
    ${product ? `<p><strong>РўРѕРІР°СЂ:</strong> ${product.name}</p>` : ''}
    <p>РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РїРѕ СѓРєР°Р·Р°РЅРЅРѕРјСѓ РєРѕРЅС‚Р°РєС‚Сѓ: ${order.contactValue}</p>
    <p>РЎ СѓРІР°Р¶РµРЅРёРµРј, РєРѕРјР°РЅРґР° Cats on Cakes</p>
  `;

  // Отправляем клиенту письмо через уже созданный SMTP-транспорт.
  const info = await transporter.sendMail({
    from: `"Cats on Cakes" <${FROM_EMAIL}>`,
    to: customerEmail,
    subject,
    html,
  });

  return info;
};
