// require sql npm
var mysql = require("mysql");
// require inquirer npm
var inquirer = require("inquirer");
// requirer console table to 
var Table = require("cli-table");
// require colors for the table;
var colors = require('colors');

// establish conncection to sql server
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

connection.connect(function (err) {
  if (err) throw err;
  // prompt the user
  displayData();

});

// table to display the data
var table = new Table({
  head: ["ITEM ID".red, "PRODUCT NAME".blue, "DEPARTMENT".yellow, "PRICE".green, "STOCK QUANTITY".blue],
  colWidths: [10, 20, 20, 10, 20]
});

// display the items available on the table include 
function displayData(err) {
  if (err) throw err;

  // empty the table before filling it again
  table.length = 0;
  /*Create a table named "Bamazon":*/
  connection.query( "Select * FROM product",
    function (err, res) {
      // use cli table to display the product by pushing the information to the defined array
      for (let i in res) {
        let item_id = res[i].item_id;
        let product_name = res[i].product_name;
        let department_name = res[i].department_name;
        let price = res[i].price;
        let stock = res[i].stock_quantity;

        table.push([item_id.toString().red, product_name.blue, department_name.yellow, price.toString().green, stock.toString().blue]);
      }
      console.log(table.toString());
      promptUser();     
    });

};

// prompt the user for what they would like to do
function promptUser() {

  inquirer
    .prompt({
      name: "item_id",
      type: "input",
      message: "Select the item by id that you would like to purchase?",
    })
    .then(function (answer) {
      // store a variable for the query we are going to look for by id chosen by the customer
      var query = "SELECT product_name, stock_quantity, price FROM product WHERE ?";
      // create function to select the product with that id
      connection.query(query, { item_id: answer.item_id }, function (err, res) {
        // initialize variables to hold the value of the name, stockquantity and price
        var product_name;
        var stock_quantity;
        var price;
        for (var i in res) {
          console.log("The product you selected was: " + res[i].product_name)
          // give the values to the variables for comparison and displaying for the user.
          product_name = res[i].product_name;
          stock_quantity = res[i].stock_quantity;
          price = res[i].price;
        }
        // console.log(product_name)
        
        inquirer.prompt({
          name: "number",
          type: "input",
          message: "How many of this item would you like to purchase?",
        })
          .then(function (answer) {
            // check if there is enough product in stock.
            
            if (answer.number <= stock_quantity)  {
              // log to the user what they purchased
              console.log("You purchased: " + answer.number + " of the product: " + product_name)
              // update the database
              // store a variable for stock left
              var stock_left = stock_quantity - answer.number
              connection.query(
                "UPDATE product SET ? WHERE ?",
                [
                  {
                    stock_quantity: stock_left
                  },
                  {
                    product_name: product_name
                  }
                ],
                function (err, res) {
                  //
                }
              );
              // find the total cost
              var total = price * answer.number;
              console.log("The total price of your purcase of " + answer.number + " " + product_name + " was: " + total);
              displayData();
              
            }
            // else output an insufficient quantity message
            else {
              console.log("Insufficient quantity! The current stock is: " + stock_left + " of: " + product_name + " Please select an amount to purchase that is within the stock quantity.");
              displayData();
            }
          })
      })
    })

}


