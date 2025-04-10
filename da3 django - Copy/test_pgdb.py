import psycopg2
from decouple import config

DB_NAME = config('DB_NAME')
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')
DB_HOST = config('DB_HOST')
DB_PORT = config('DB_PORT')  # Chuyển thành số nguyên

try:
    connection = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    print("✅ Kết nối thành công tới PostgreSQL!")

    # Tùy chọn: test câu SQL đơn giản
    cursor = connection.cursor()
    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    print("📌 Phiên bản PostgreSQL:", db_version)

except Exception as error:
    print("❌ Lỗi kết nối:", error)

finally:
    if 'connection' in locals() and connection:
        connection.close()
        print("🔒 Đã đóng kết nối.")
