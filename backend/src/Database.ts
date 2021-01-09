import mysql from 'mysql';

const con = mysql.createConnection({
    host: '192.168.0.30',
    user: 'mediacenteruser',
    password: 'mediapassword',
    database: 'hub',
    insecureAuth: true
});

export function connect(): void {
    con.connect(function (err) {
        if (err) throw err;
        console.log('Connected!');
    });
}

export function query(sql: string): void {
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('Result: ' + result);
    });
}
