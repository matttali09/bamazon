// require sql npm
var mysql = require("mysql");
// require inquirer npm
var inquirer = require("inquirer");
// requirer console table to 
const cTable = require('console.table');

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
  // display the data
  displayData();
  // prompt the user
  promptUser();
});

// display the items available on the table include 
function displayData(err) {
  if (err) throw err;
  console.log("Connected!");
  /*Create a table named "Bamazon":*/
  connection.query( "Select * FROM product",
    function (err, res) {
      
      // use console table to display the product
      for (var i in res) {
        var values = {}
        values += [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
      }     
      console.table(['item_id', 'product_name', 'department_name', 'price', 'stock_quantatiy'], values);
    }
  )
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
        console.log("The product you selected was: " + product_name)
        inquirer.prompt({
          name: "number",
          type: "input",
          message: "How many of this item would you like to purchase?",
        })
          .then(function (answer2) {
            // check if there is enough product in stock.
            if (answer2.number <= stock_quantity) {
              // log to the user what they purchased
              console.log("You purchased: " + answer2.number + " of the product: " + product_name)
              // update the database
              // store a variable for stock left
              var stock_left = stock_quantity - answer2.number
              connection.query(
                "UPDATE product SET ? WHERE ?",
                [
                  {
                    stock_quantity: stock_left
                  },
                  {
                    product_name: answer.item_id
                  }
                ],
                function (err, res) {
                  //
                }
              );
              // find the total cost
              var total = price * answer.number;
              console.log("The total price of your purcase of " + answer.number + " " + product_name + " was: " + total);
              promptUser();

            }
            // else output an insufficient quantity message
            else {
              console.log("Insufficient quantity! The current stock is: " + stock_quantity + " of: " + product_name + "Please select an amount to purchase that is within the stock quantity.");
              promptUser();
            }

          })
      })
    })

}


