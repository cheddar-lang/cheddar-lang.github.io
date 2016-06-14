@ECHO OFF

REM Cheddar install script for windows
REM Author: Conor O'Brien

SET SILENT=^>nul 2^>^&1

WHERE git %SILENT%

IF %ERRORLEVEL% NEQ 0 (
	ECHO You appear not to have git installed. Please proceed to the following link:
	ECHO   https://git-scm.com/download/win
	GOTO EOF
)

WHERE npm %SILENT%
IF %ERRORLEVEL% NEQ 0 (
	ECHO You appear not to have npm installed. Please proceed to the following link:
	ECHO   https://nodejs.org/en/
	GOTO EOF
)

REM check if we have a cheddar folder already
IF EXIST Cheddar (
	SET request=a
	:validateLoop
		SET /P request=Folder 'Cheddar' will be overwritten. Proceed? [y,n] 
		IF %request%==y GOTO continue
		IF %request%==n GOTO EOF
		GOTO validateLoop
)

:continue
RMDIR Cheddar /S /Q %SILENT%

git clone http://github.com/cheddar-lang/Cheddar.git
CD Cheddar
npm install
:EOF
