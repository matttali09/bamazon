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
        if (user.doingWhat === "View Product Sales by Department") {
            displayData();
        }
        else {
            addDepartment();
        }
    });
};

// table to display the data
var table = new Table({
    head: ["DEPARTMENT ID".red, "DEPARTMENT NAME".blue, "OVER HEAD COSTS".green, "PRODUCT SALES".yellow, "TOTAL PROFIT".blue],
    colWidths: [15, 20, 25, 20, 20]
});

// display the items available on the table include 
function displayData(err) {
    if (err) throw err;

    // empty the table before filling it again
    table.length = 0;
    // store query to get data from both databases
    var query = "SELECT product.department_name, product.product_sales, department.department_id, department.department_name, department.over_head_costs FROM department INNER JOIN product ON (product.department_name = department.department_name) ORDER BY department.department_id ";
    // Create a table from all the information in the response for the sql table. 
    connection.query(query,
        function (err, res) {
            // use cli table to display the product by pushing the information to the defined array
            for (let i in res) {
                let department_id = res[i].department_id;
                let department_name = res[i].department_name;
                let over_head_costs = res[i].over_head_costs;
                let product_sales = res[i].product_sales;
                let total_profit = product_sales - over_head_costs;
                

                table.push([department_id.toString().red, department_name.blue, "$".green + over_head_costs.toString().green + ".00".green, product_sales.toString().yellow, "$".green + total_profit.toString().green + ".00".green]);
            }
            
            console.log(table.toString());
            promptUser();
        });

};
