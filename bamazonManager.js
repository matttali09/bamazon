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
// prompt the manager for what they would like to do
function promptUser() {
    // Create a series of questions starting with what the manager would like to do
    inquirer.prompt([

        {
            type: "list",
            name: "doingWhat",
            message: "Which application would you like to use?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        },

    ]).then(function (user) {

        // if the manager chooses view every available item's item IDs, names, prices, and quantities.
        if (user.doingWhat === "View Products for Sale") {
            displayData();
        }
        else if (user.doingWhat === "View Low Inventory") {
            viewLowStock();
        }
        else if (user.doingWhat === "Add to Inventory") {
            addInventory();
        }
        else {
            addProduct();
        }
    });
};

// table to display the data
var table = new Table({
    head: ["ITEM ID".red, "PRODUCT NAME".blue, "PRICE".green, "STOCK QUANTITY".yellow],
    colWidths: [10, 20, 15, 20]
});

// display the items available on the table include 
function displayData(err) {
    if (err) throw err;

    // empty the table before filling it again
    table.length = 0;
    // Create a table from all the information in the response for the sql table. 
    connection.query("Select * FROM product",
        function (err, res) {
            // use cli table to display the product by pushing the information to the defined array
            for (let i in res) {
                let item_id = res[i].item_id;
                let product_name = res[i].product_name;
                let price = res[i].price;
                let stock = res[i].stock_quantity;

                table.push([item_id.toString().red, product_name.blue, "$".green+price.toString().green + ".00".green, stock.toString().yellow]);
            }
            console.log(table.toString());
            promptUser();
        });

};

// function to view low inventory
function viewLowStock(err) {
    if (err) throw err;

    // empty the table before filling it again
    table.length = 0;
    // Create a table from all the information in the response for the sql table. 
    connection.query("Select * FROM product",
        function (err, res) {
            // use cli table to display the product by pushing the information to the defined array
            for (let i in res) {
                if (res[i].stock_quantity < 20) {
                    let item_id = res[i].item_id;
                    let product_name = res[i].product_name;
                    let price = res[i].price;
                    let stock = res[i].stock_quantity;

                    table.push([item_id.toString().red, product_name.blue, price.toString().green, stock.toString().yellow]);
                }
            }
            console.log(table.toString());
            promptUser();
        });

};

// prompt the manager for what item they would like to add to
function addInventory() {

    inquirer
        .prompt({
            name: "item_id",
            type: "input",
            message: "Select the item by id that you would like to purchase?",
        })
        .then(function (answer) {
            // store a variable for the query we are going to look for by id chosen by the manager
            var query = "SELECT product_name, stock_quantity, price FROM product WHERE ?";
            // create function to select the product with that id
            connection.query(query, { item_id: answer.item_id }, function (err, res) {
                // initialize variables to hold the value of the name, stockquantity and price
                var product_name;
                var stock_quantity;
                for (var i in res) {
                    console.log("The product you selected was: " + res[i].product_name)
                    // give the values to the variables for comparison and displaying for the user.
                    product_name = res[i].product_name;
                    stock_quantity = res[i].stock_quantity;
                }
                // console.log(product_name)

                inquirer.prompt({
                    name: "number",
                    type: "input",
                    message: "How many units of this item would you like to add?",
                })
                    .then(function (answer) {
                        // log to the user what they purchased
                        console.log("You added: " + answer.number + " of the product: " + product_name)

                        // store a variable for stock left
                        var updatedStock = stock_quantity + parseInt(answer.number)

                        // update the database
                        connection.query(
                            "UPDATE product SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: updatedStock
                                },
                                {
                                    product_name: product_name
                                }
                            ],
                            function (err, res) {
                                //
                            }
                        );
                        // run prompt user again to restart the dialog 
                        promptUser();
                    });
            });
        });

};

// function the manager for what item they would like to add
function addProduct() {
    // prompt the manager for the name of the item
    inquirer
        .prompt({
            name: "product_name",
            type: "input",
            message: "What is the name of the product you would like to add?",
        })
        .then(function (answer) {
            // store product_name to create the new product when all the information is acquired
            var product_name = answer.product_name

            // prompt the manager how much stock of the product will be added
            inquirer.prompt({
                name: "number",
                type: "input",
                message: "How many units of this item would you like to add?",
            })
                .then(function (answer) {
                    //store stock quantity to be used in final product creation
                    var stock_quantity = answer.number
                    // log to the user what they purchased
                    console.log("You will add: " + stock_quantity + " of the product: " + product_name)

                    //prompt the manager for department name
                    inquirer.prompt({
                        name: "name",
                        type: "input",
                        message: "What is the name of the department that it will be added to?",
                    })
                        .then(function (answer) {
                            //store stock quantity to be used in final product creation
                            var department_name = answer.name
                            // log to the manager the department name fo the new product
                            console.log(product_name + " will be in the " + department_name + " department")

                            //prompt the manager for the price
                            inquirer.prompt({
                                name: "number",
                                type: "input",
                                message: "What will be the price of the new item",
                            })
                                .then(function (answer) {
                                    //store stock quantity to be used in final product creation
                                    var price = answer.number
                                    // log to the manager the price of the new product
                                    console.log("The price of " + product_name + " will be: " + price)

                                    // update the database with the new product using the stored values
                                    connection.query(
                                        "INSERT INTO product SET ?",
                                        {
                                            product_name: product_name,
                                            stock_quantity: stock_quantity,
                                            department_name: department_name,
                                            price: price
                                        },
                                        function (err, res) {
                                        }
                                    );
                                    // run prompt user again to restart the dialog 
                                    promptUser();
                                });

                    });
                });

        });

};
