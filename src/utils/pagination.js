module.exports.get = (data, offset = 0, limit = 10) => {
  if (!data || data.length < 1) return data
  return data.slice(offset * limit, (offset + 1) * limit)
}

// CREATE OR REPLACE PROCEDURE TTKD_BKN.PAGING
// (
//     v_sql       IN VARCHAR,
//     v_offset    IN NUMBER,
//     v_limmit    IN NUMBER,
//     v_order     IN VARCHAR,
//     v_total     IN OUT NUMBER,
//     v_data      OUT SYS_REFCURSOR
// ) AS
// str VARCHAR2(10000);
// BEGIN
//     str:='SELECT COUNT(*) total FROM ('||v_sql||')';
//     EXECUTE IMMEDIATE str INTO v_total;
//     str:='SELECT * FROM ('||v_sql||')';
//     IF(LENGTH(v_order)>0) THEN str:=str||' ORDER BY '||v_order; END IF;
//     IF(v_limmit>0) THEN
//         IF(v_offset=0) THEN
//         str:=str||' FETCH FIRST '||v_limmit||' ROWS ONLY';
//         ELSE
//         str:=str||' OFFSET '||((v_offset-1)*v_limmit)||' ROWS FETCH NEXT '||v_limmit||' ROWS ONLY';
//         END IF;
//     END IF;
//     --str:='select '''||str||''' from dual';
//     OPEN v_data FOR str;
// END;
