const { transporter } = require("../utils/nodemailer");

module.exports.sendEmail = async (data) => {
  try {
    await transporter.sendMail({
      from: data.from, // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
    });
  } catch (err) {
    console.log(err);
  }
};
