@echo off
echo.         -----------------------------
echo.           Stop LocalStack Container
echo.         -----------------------------
docker rm -f localstack > nul
set "localstackRestoreCheck=docker ps"
echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
echo.          Is LocalStack stopped ?
echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
:loopHealthCheck
echo.          Stopping LocalStack...
timeout 1 > nul
For /F "delims=" %%G In ('%localstackRestoreCheck%') Do Set localStackHealth=%%G
echo %localStackHealth% | findstr /m "localstack"
if %errorlevel%==0 (
  goto loopHealthCheck
) else (
  echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  echo.          LocalStack Stopped!!!
  echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
)