@echo off
echo.         ------------------------------
echo.           Start LocalStack Container
echo.         ------------------------------
rmdir C:\Temp\LocalStack\kinesis /s /q
del C:\Temp\LocalStack\startup_info.json
docker run -d --name localstack --restart always -p 4566:4566 -p 8001:8080 ^
-v C:/Temp/LocalStack/:/tmp/localstack/data ^
--env DEBUG=1 --env LOCALSTACK_DATA_DIR=/tmp/localstack/data --env DATA_DIR=/tmp/localstack/data ^
--env LOCALSTACK_DEFAULT_REGION=sa-east-1 --env LOCALSTACK_TMPDIR=/tmp/localstack ^
 --env SERVICES=s3,sqs ^
 --cpus="1.5" --memory="3072m" ^
localstack/localstack:0.14.3

echo.         ----------------------------
echo.           Restored AMN Local Setup
echo.         ----------------------------