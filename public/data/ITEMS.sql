SET SQLBLANKLINES ON;
SET DEFINE OFF;
ALTER SESSION SET NLS_DATE_FORMAT = 'MM/DD/SYYYY HH24:MI:SS';
ALTER SESSION SET NLS_TIMESTAMP_TZ_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF TZH:TZM';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF';
ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,';
ALTER SESSION SET NLS_NCHAR_CONV_EXCP = FALSE;
ALTER SESSION SET TIME_ZONE = '+07:00';

--
-- Create table "TTKD_BKN"."ITEMS"
--
CREATE TABLE TTKD_BKN.ITEMS (
  ID         NUMBER             DEFAULT "TTKD_BKN"."ITEMS_PK".nextval NOT NULL,
  APP_KEY    VARCHAR2(128 BYTE) NOT NULL,
  GROUP_ID   NUMBER,
  TITLE      VARCHAR2(128 BYTE) NOT NULL,
  ICON       VARCHAR2(128 BYTE),
  IMAGE      VARCHAR2(512 BYTE),
  URL        VARCHAR2(128 BYTE),
  ORDERS     NUMBER,
  QUANTITY   NUMBER,
  DESCS      VARCHAR2(256 BYTE),
  CONTENT    VARCHAR2(2000 BYTE),
  ATTACH     VARCHAR2(512 BYTE),
  TAGS       VARCHAR2(128 BYTE),
  CREATED_IP VARCHAR2(128 BYTE) NOT NULL,
  CREATED_BY VARCHAR2(128 BYTE) NOT NULL,
  CREATED_AT DATE               NOT NULL,
  UPDATED_IP VARCHAR2(128 BYTE),
  UPDATED_BY VARCHAR2(128 BYTE),
  UPDATED_AT DATE,
  DELETED_IP VARCHAR2(128 BYTE),
  DELETED_BY VARCHAR2(128 BYTE),
  DELETED_AT DATE,
  FLAG       NUMBER(1, 0)       NOT NULL,
  CONSTRAINT ITEMS_PK PRIMARY KEY (ID) USING INDEX TABLESPACE USERS STORAGE (INITIAL 64 K
                                                                             NEXT 1 M
                                                                             MAXEXTENTS UNLIMITED)
)
TABLESPACE USERS
STORAGE (INITIAL 64 K
         NEXT 1 M
         MAXEXTENTS UNLIMITED)
LOGGING;

COMMIT;

-- CREATE SEQUENCE
CREATE SEQUENCE ITEMS_PK START WITH 1 INCREMENT BY 1 CACHE 100;
ALTER TABLE ITEMS MODIFY (ID DEFAULT "ITEMS_PK" );
ALTER TABLE ITEMS ADD (CONSTRAINT ITEMS_PK PRIMARY KEY (ID));
COMMIT;