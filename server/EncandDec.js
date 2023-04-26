import crypto from "crypto";
// Code for encryption and decryption of passwords
export const encryption = (password, key) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(key), iv);

  const encrptedpass = Buffer.concat([cipher.update(password), cipher.final()]);

  return { iv: iv.toString("hex"), password: encrptedpass.toString("hex") };
};

export const decrpytion = (encrptpassword) => {
  const deciphers = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(encrptpassword.key),
    Buffer.from(encrptpassword.iv, "hex")
  );

  const decrptpass = Buffer.concat([
    deciphers.update(Buffer.from(encrptpassword.password, "hex")),
    deciphers.final(),
  ]);

  return decrptpass.toString();
};
