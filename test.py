from werkzeug.security import generate_password_hash

hashed_password = generate_password_hash('admin', method='pbkdf2:sha256')
print(hashed_password)




#*--- VOOR HET GENEREREN VAN EEN HASHPASSWORD VOOR "admin"--- 