import emailjs from 'emailjs-com';

export const sendOrderEmail = (orderData) => {
  const templateParams = {
    user_name: orderData.customerName,
    user_email: orderData.customerEmail,
    order_id: orderData.orderId,
    total_amount: orderData.totalAmount,
  };
  return emailjs.send(
    'service_rcsrnp8',
    'template_ybqlqni',
    templateParams,
    '8AXdbA7Jqn4IOHIO_'
  );
};

