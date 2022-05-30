@echo off
set "localstackHealthCheck=curl -s "http://localhost:4566/health""
set "localstackRestoreCheck=docker logs localstack --tail 50"
echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
echo.          Is LocalStack initialized ?
echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
:loopHealthCheck
timeout 2 > nul
For /F "delims=" %%G In ('%localstackHealthCheck%') Do Set localStackHealth=%%G
echo %localStackHealth% | findstr /m /c:"initialized" /c:"initialized"
if %errorlevel%==1 (
  echo.          Checking Health for LocalStack...
  goto loopHealthCheck
) else (
  echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  echo.          LocalStack initialized!!!
  echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  For /F "delims=" %%G In ('%localstackRestoreCheck%') Do Set localStackRestoreHealth=%%G
  echo %localStackRestoreHealth% | findstr /m "API calls from persistent file"
  if %errorlevel%==1 (
    echo.          Checking Restore for LocalStack...
    goto loopHealthCheck
  ) else (
    echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    echo.          LocalStack Restored!!!
    echo.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  )
)
goto DONE

:DONE