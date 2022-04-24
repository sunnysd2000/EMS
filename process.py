from umbral import SecretKey, Signer
from umbral import encrypt, decrypt_original
from umbral import generate_kfrags
from umbral import reencrypt
from umbral import decrypt_reencrypted
from umbral import pre
import sys

# generate the keys

def setupAlice():
  alices_secret_key = SecretKey.random()
  alices_public_key = alices_secret_key.public_key()

  alices_signing_key = SecretKey.random()
  alices_signer = Signer(alices_signing_key)
  #alices_verifying_key = alices_signing_key.public_key()
  return alices_secret_key, alices_public_key, alices_signer

def setupBob():
  bobs_secret_key = SecretKey.random()
  bobs_public_key = bobs_secret_key.public_key()  
  return bobs_secret_key, bobs_public_key

def encr(m):
  # Encrypt data with Alice's public key.
  plaintext = bytes(m, 'utf-8')
  capsule, ciphertext = encrypt(alices_public_key, plaintext)
  return capsule, ciphertext

def decrypt_org(capsule, ciphertext):
  cleartext = decrypt_original(alices_secret_key, capsule, ciphertext)
  print(cleartext)

alices_secret_key, alices_public_key, alices_signer = setupAlice()
setupAlice()
bobs_secret_key, bobs_public_key = setupBob()

# encrypt the message
msg = sys.argv[1]
capsule, encrypted_text = encr(msg)
print(capsule,encrypted_text)

# decrypted msg
# print("org decrypted msg: ")
# decrypt_org(capsule, encrypted_text)
