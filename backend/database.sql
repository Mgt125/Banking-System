CREATE TABLE Address(
    AddressID INT PRIMARY KEY AUTO_INCREMENT,
    Street VARCHAR(255) NOT NULL,
    City  VARCHAR(100) NOT NULL,
    Province VARCHAR(100) NOT NULL,
    PostalCode VARCHAR(4) NOT NULL,
    Country VARCHAR(100) NOT NULL
);

CREATE TABLE Employee(
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeFName VARCHAR(50) NOT NULL,
    EmployeeLName VARCHAR(50) NOT NULL,
    EmployeePosition VARCHAR(50) NOT NULL,
    EmployeeEmail VARCHAR(100) NOT NULL,
    EmployeePhone VARCHAR(20) NOT NULL
);

CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    UserFName VARCHAR(50) NOT NULL,
    UserLName VARCHAR(50) NOT NULL,
    CustomerPhone VARCHAR(20) NOT NULL,
    CustomerEmail VARCHAR(100) NOT NULL,
    customerDOB DATE NOT NULL,
    CustomerPassword VARCHAR(255) NOT NULL,
    AddressID INT DEFAULT NULL,
    FOREIGN KEY (AddressID) REFERENCES Address(AddressID)
);

CREATE TABLE Account (
    AccountID INT PRIMARY KEY AUTO_INCREMENT,
    AccountType VARCHAR(50) NOT NULL DEFAULT 'Checking',
    AccountBalance Decimal(15, 2) NOT NULL DEFAULT 0.00,
    CustomerID INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE Transaction (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    TransactionType VARCHAR(50) NOT NULL,
    TransactionAmount DECIMAL(15, 2) NOT NULL,
    TransactionDate DATETIME NOT NULL,
    AccountID INT NOT NULL,
    FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);