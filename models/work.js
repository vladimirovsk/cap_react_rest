const works = {

    SelectPayMount: {
        name: 'select pay mount',
        required_fields: ['client_id, year_yyyy'],
        text: `SELECT to_char(p.createdat, 'mm.yyyy'::text) AS date,
                count(p.id) AS count, sum(p.amount) AS sum, p.storno_id,
                p.client_id
              FROM payments p
              WHERE (
              p.createdat >= $2::timestamp without time zone
              and
              p.createdat <= $3::timestamp without time zone 
              )
              AND p.pay_id_bank > 0 AND p.pay_id_tgo >= 0
              and p.client_id =$1
              and p.storno_id =0
              GROUP BY (to_char(p.createdat, 'mm.yyyy'::text)), p.storno_id, p.client_id 
              ORDER BY (to_char(p.createdat, 'mm.yyyy'::text)), p.storno_id, p.client_id
              `
    }
}

module.exports = works;
