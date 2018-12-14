DROP database IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE product (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(20,2) NULL,
  stock_quantity Integer(20) NULL,
  product_sales DECIMAL(20,2) DEFAULT 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(20,2) NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES ("Bannanas", "Food", 4.00, 200),("Steak", "Food", 20.00, 150), ("Animal Crackers", "Food", 2.00, 200), ("Plasma TV", "Electronics", 1000.00, 140), ("Nintendo Switch", "Electronics", 300.00, 80), ("Splatoon", "Electronics", 60.00, 400), ("Breath of The Wild", "Electronics", 60.00, 300), ("Mahogony Table", "Home", 198.00, 60), ("Bycicle", "Sports", 79.00, 300), ("Tennis Set", "Sports", 57.00, 200);

INSERT INTO department (department_name, over_head_costs) 
VALUES ("Food", 550), ("Electronics", 2000), ("Home", 200), ("Sports", 750);