class TableUtils {

    constructor(){}

    // document.getElementById("myTable").rows

    static Column(colIndex) {
        var data = [];
        var table = document.getElementsByTagName('table')[0];
        for (var i=0;i < table.rows.length; i++) {
            data.push(table.rows[i].cells[colIndex]);
        }
        return data;
    }
}