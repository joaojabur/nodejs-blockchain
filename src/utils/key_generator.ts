import ellipitic, {  } from 'elliptic';
const EC = ellipitic.ec;
const ec = new EC("secp256k1");

function generateKey(): Array<any> {
    const key = ec.genKeyPair();
    const public_key = key.getPublic('hex');
    const private_key = key.getPrivate('hex');

    return [public_key, private_key];
};

export default generateKey;