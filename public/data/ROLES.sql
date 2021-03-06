SET SQLBLANKLINES ON;
SET DEFINE OFF;
ALTER SESSION SET NLS_DATE_FORMAT = 'MM/DD/SYYYY HH24:MI:SS';
ALTER SESSION SET NLS_TIMESTAMP_TZ_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF TZH:TZM';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF';
ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,';
ALTER SESSION SET NLS_NCHAR_CONV_EXCP = FALSE;
ALTER SESSION SET TIME_ZONE = '+07:00';

--
-- Create table "TTKD_BKN"."ROLES"
--
CREATE TABLE TTKD_BKN.ROLES (
  ID         VARCHAR2(32 BYTE)  DEFAULT SYS_GUID() NOT NULL,
  NAME       VARCHAR2(256 BYTE) NOT NULL,
  ORDERS     NUMBER(5, 0)       NOT NULL,
  DESCS      VARCHAR2(256 BYTE),
  CREATED_BY VARCHAR2(128 BYTE) NOT NULL,
  CREATED_AT DATE               NOT NULL,
  UPDATED_BY VARCHAR2(128 BYTE),
  UPDATED_AT DATE,
  DELETED_BY VARCHAR2(128 BYTE),
  DELETED_AT DATE,
  FLAG       NUMBER(*, 0)       NOT NULL,
  COLOR      VARCHAR2(128 BYTE),
  CODE       VARCHAR2(128 BYTE),
  LEVELS     NUMBER(3, 0),
  ROLES      NVARCHAR2(2000)
)
TABLESPACE USERS
STORAGE (INITIAL 64 K
         NEXT 1 M
         MAXEXTENTS UNLIMITED)
LOGGING;

COMMIT;


SET SQLBLANKLINES ON;
SET DEFINE OFF;
ALTER SESSION SET NLS_DATE_FORMAT = 'MM/DD/SYYYY HH24:MI:SS';
ALTER SESSION SET NLS_TIMESTAMP_TZ_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF TZH:TZM';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF';
ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,';
ALTER SESSION SET NLS_NCHAR_CONV_EXCP = FALSE;
ALTER SESSION SET TIME_ZONE = '+07:00';

INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('9EEB2815CB99E9C4E053AD3410ACB093', 'Tuyến thu', 3, NULL, 'tuanpm.bkn', '02/19/2020 16:10:15', 'tuanpm.bkn', '02/19/2020 16:15:54', NULL, NULL, 1, '{"backgroundColor":"#de10a7","color":"rgb(255,255,255)"}', 'tuyenthu', 3, NULL);
INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('fea17f382db343e9b458e5eedcacd3f6', 'Doanh thu', 2, NULL, 'minhhh.bkn', '06/29/2019 15:14:53', 'tuanpm.bkn', '02/19/2020 16:15:17', NULL, NULL, 1, '{"backgroundColor":"#027be3","color":"white"}', 'doanhthu', 4, NULL);
INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('3bacc415d7274927a424e2b777ff5dc2', 'Giám đốc PBH', 2, NULL, 'tuanpm.bkn', '04/04/2019 13:43:43', 'tuanpm.bkn', '02/19/2020 16:14:42', NULL, NULL, 1, '{"backgroundColor":"#673ab7","color":"rgb(255,255,255)"}', 'gdpbh', 2, NULL);
INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('1dd9ac719fea49efa9f405fbaca175e1', 'QL Kế hoạch', 1, NULL, 'tuanpm.bkn', '05/10/2019 09:09:30', 'tuanpm.bkn', '02/19/2020 16:15:06', NULL, NULL, 1, '{"backgroundColor":"primary","color":"white"}', 'qlkehoach', 4, NULL);
INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('60883b1e425f49d2b70a2340f98f99cd', 'Admin', 1, NULL, 'tuanpm.bkn', '04/01/2019 16:36:48', 'tuanpm.bkn', '02/25/2020 14:46:17', NULL, NULL, 1, '{"backgroundColor":"#c10015","color":"rgb(255,255,255)"}', 'admin', 1, NULL);
INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('d24c38b3ed944dcbab8cf57835dd4ab4', 'Giám đốc DN', 1, NULL, 'tuanpm.bkn', '04/17/2019 20:43:23', 'tuanpm.bkn', '02/19/2020 16:14:38', NULL, NULL, 1, '{"backgroundColor":"#9c27b0","color":"rgb(255,255,255)"}', 'gddn', 2, NULL);
INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('4366a490adc94f68aa1e3b5611d16243', 'Doanh nghiệp', 1, NULL, 'tuanpm.bkn', '04/17/2019 16:27:46', 'tuanpm.bkn', '02/19/2020 16:14:51', NULL, NULL, 1, '{"backgroundColor":"#ff5722","color":"rgb(255,255,255)"}', 'doanhnghiep', 3, NULL);
INSERT INTO TTKD_BKN.ROLES(ID, NAME, ORDERS, DESCS, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT, DELETED_BY, DELETED_AT, FLAG, COLOR, CODE, LEVELS, ROLES) VALUES
('253047ee57894ded98f5d687a61dbdb9', 'Giao dịch', 2, NULL, 'tuanpm.bkn', '04/04/2019 10:36:10', 'tuanpm.bkn', '02/19/2020 16:14:58', NULL, NULL, 1, '{"backgroundColor":"#4caf50","color":"rgb(255,255,255)"}', 'giaodich', 3, NULL);

COMMIT;