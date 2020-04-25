SET SQLBLANKLINES ON;
SET DEFINE OFF;
ALTER SESSION SET NLS_DATE_FORMAT = 'MM/DD/SYYYY HH24:MI:SS';
ALTER SESSION SET NLS_TIMESTAMP_TZ_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF TZH:TZM';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF';
ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,';
ALTER SESSION SET NLS_NCHAR_CONV_EXCP = FALSE;
ALTER SESSION SET TIME_ZONE = '+07:00';

--
-- Create table "TTKD_BKN"."NGUOIDUNG"
--
CREATE TABLE TTKD_BKN.NGUOIDUNG (
  NGUOIDUNG_ID   NUMBER(6, 0) NOT NULL,
  MATKHAU        VARCHAR2(128 BYTE),
  SALT           VARCHAR2(128 BYTE),
  ROLES_ID       VARCHAR2(128 BYTE),
  LAST_LOGIN     DATE,
  UPDATED_BY     VARCHAR2(128 BYTE),
  UPDATED_AT     DATE,
  CHANGE_PASS_BY VARCHAR2(128 BYTE),
  CHANGE_PASS_AT DATE,
  LOCKED_BY      VARCHAR2(128 BYTE),
  LOCKED_AT      DATE,
  FLAG           NUMBER(1, 0),
  CONSTRAINT NGUOIDUNG_PK PRIMARY KEY (NGUOIDUNG_ID) USING INDEX TABLESPACE USERS STORAGE (INITIAL 64 K
                                                                                           NEXT 1 M
                                                                                           MAXEXTENTS UNLIMITED)
)
TABLESPACE USERS
STORAGE (INITIAL 64 K
         NEXT 1 M
         MAXEXTENTS UNLIMITED)
LOGGING;

COMMIT;

INSERT INTO TTKD_BKN.NGUOIDUNG(NGUOIDUNG_ID, MATKHAU, SALT, ROLES_ID, LAST_LOGIN, UPDATED_BY, UPDATED_AT, CHANGE_PASS_BY, CHANGE_PASS_AT, LOCKED_BY, LOCKED_AT, FLAG) VALUES
(6391, '4e0f1aeef776e0892e7c722c091c62c9', '853a99b2-3087-4e38-aa67-1e642315a6a5', '60883b1e425f49d2b70a2340f98f99cd', '04/24/2020 14:16:14', NULL, NULL, 'tuanpm.bkn', '04/23/2019 10:36:15', NULL, NULL, NULL);
SELECT * FROM ADMIN_BKN.nguoidung WHERE MA_ND='tuanpm.bkn';