const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'steevemondithoka@gmail.com',
    pass: 'rrnpqavblwprnkwe', // paste directly here to test
  },
});

transporter.verify((err, success) => {
  if (err) console.log('FAILED:', err.message);
  else console.log('SUCCESS — Gmail connected!');
});