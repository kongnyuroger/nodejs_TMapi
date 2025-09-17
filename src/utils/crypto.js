import crypto from 'crypto'
import util from 'util'

const scrypt = util.promisify(crypto.scrypt);


export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex'); 
  const derivedKey = await scrypt(password, salt, 64); 
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  const derivedKey = await scrypt(password, salt, 64);
  return key === derivedKey.toString('hex');
}
