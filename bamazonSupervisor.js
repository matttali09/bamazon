// require sql npm
var mysql = require("mysql");
// require inquirer npm
var inquirer = require("inquirer");
// requirer console table to 
var Table = require("cli-table");
// require colors for the table;
var colors = require('colors');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazonDB"
});

// connect to the sql database
connection.connect(function (err) {
    if (err) throw err;
    // prompt the user
    promptUser();
  
});

function promptUser() {
    // Create a series of questions starting with what the manager would like to do
    inquirer.prompt([

        {
            type: "list",
            name: "doingWhat",
            message: "Which application would you like to use?",
            choices: ["View Product Sales by Department", "Create New Department"]
        },

    ]).then(function (user) {

        // if the manager chooses view every available item's item IDs, names, prices, and quantities.
        if (user.doingWhat === "View Products for Sale") {
            displayData();
        }
        else {
            addDepartment();
        }
    });
};

// table to display the data
var table = new Table({
    head: ["ITEM ID".red, "PRODUCT NAME".blue, "PRICE".green, "STOCK QUANTITY".yellow],
    colWidths: [10, 20, 10, 20]
});

// display the items available on the table include 
function displayData(err) {
    if (err) throw err;

    // empty the table before filling it again
    table.length = 0;
    // store query to get data from both databases
    var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year ";
    // Create a table from all the information in the response for the sql table. 
    connection.query("Select * FROM product",
        function (err, res) {
            // use cli table to display the product by pushing the information to the defined array
            for (let i in res) {
                let item_id = res[i].item_id;
                let product_name = res[i].product_name;
                let price = res[i].price;
                let stock = res[i].stock_quantity;

                table.push([item_id.toString().red, product_name.blue, price.toString().green, stock.toString().yellow]);
            }
            console.log(table.toString());
            promptUser();
        });

};
