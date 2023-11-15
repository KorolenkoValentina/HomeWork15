/*"Каса":

    Відповідає за продаж квитків. Квитки можуть бути трьох видів: дорослі, дитячі та сімейні.

    Кожен квиток має вартість.

    Під час продажу квитка, Каса додає дані про відвідувача у два списки: поточні відвідувачі та клієнти.*/

interface Ticket {
  getCost(): number;
}

class AdultTicket implements Ticket {
  private cost: number;

  constructor(cost: number) {
    this.cost = cost;
  }

  getCost() {
    return this.cost;
  }
}

class ChildTicket implements Ticket {
  private cost: number;

  constructor(cost: number) {
    this.cost = cost;
  }

  getCost() {
    return this.cost;
  }
}

class FamilyTicket implements Ticket {
  private cost: number;

  constructor(cost: number) {
    this.cost = cost;
  }

  getCost() {
    return this.cost;
  }
}
type TicketType = 'adult' | 'child' | 'family';

class TicketFactory {
  createTicket(type: TicketType, cost: number): Ticket {
    switch(type) {
      case 'adult':
        return new AdultTicket(cost);
      case 'child':
        return new ChildTicket(cost);
      case 'family':
        return new FamilyTicket(cost);
      default:
        throw new Error(`Invalid ticket type: ${type}`);
    }
  }
}


/*"Поточні відвідувачі":

  Зберігає інформацію про відвідувачів, включаючи їхні імена та контактні дані.

  Можливість оповіщення відвідувачів за 15 хвилин до закриття і перед відходом.*/

interface Person {
  getName(): string;
  getContactInfo(): string;
}

interface Observer {
  update(message: string): void;
}

class Visitor implements Person, Observer {
  private name: string;
  private contactInfo: string;
    
  constructor(name: string, contactInfo: string) {
    this.name = name;
    this.contactInfo = contactInfo;
  }
    
  getName() {
    return this.name;
  }
    
  getContactInfo() {
    return this.contactInfo;
  }

  update(message: string) {
    console.log(`Message received: ${message}`);
  }
}

class CurrentVisitors {
  private observers: Observer[] = [];

  addVisitor(visitor: Visitor) {
    this.observers.push(visitor);
  }

  notifyVisitorsBeforeClosing() {
    this.observers.forEach(observer => {
      observer.update("The zoo closes in 15 minutes.");
    });
  }

  notifyVisitorsBeforeLeaving() {
    this.observers.forEach(observer => {
      observer.update("The zoo will close now. Thank you for visiting!");
    });
  }
}



/*"Клієнти":

  Дані клієнтів зберігаються у Відділу реклами.

  Відділ реклами використовує цей список для розсилки новин про зоопарк і рекламні акції.*/


class Client implements Person {
  private name: string;
  private contactInfo: string;
    
  constructor(name: string, contactInfo: string) {
    this.name = name;
    this.contactInfo = contactInfo;
  }
    
  getName() {
    return this.name;
  }
    
  getContactInfo() {
    return this.contactInfo;
  }
}


class TicketOffice {
  private currentVisitors: CurrentVisitors;
  private advertisingDepartment: AdvertisingDepartment;
  private revenue: Revenue;

  constructor(currentVisitors: CurrentVisitors, advertisingDepartment: AdvertisingDepartment, revenue: Revenue) {
    this.currentVisitors = currentVisitors;
    this.advertisingDepartment = advertisingDepartment;
    this.revenue = revenue;
  }

  sellTicket(visitor: Visitor, ticket: Ticket) {
    const cost = ticket.getCost();
    this.revenue.addToDailyRevenue(new Date().toISOString(), cost);
    this.currentVisitors.addVisitor(visitor);
  }

  addClient(client: Client) {
    this.advertisingDepartment.addClient(client);
  }
}

/*"Відділ реклами":

  Відповідає за маркетингові та рекламні заходи.

  Використовує список клієнтів для розсилки новин про зоопарк і рекламні акції.*/

interface Department {
  sendPromotions(): void;
}
  

class AdvertisingDepartment implements Department {
  private clients: Client[] = [];

  addClient(client: Client) {
    this.clients.push(client);
  }

  sendPromotions() {
    this.clients.forEach(client => {
      console.log(`Sending an advertising campaign to the client ${client.getName()} to the address ${client.getContactInfo()}`);
    });
  }
}


/*"Виручка":

Каса збирає дані про виручку за день.

Ці дані передаються в Бухгалтерію.*/
interface RevenueData {
  date: string;
  amount: number;
}

class Revenue {
  private dailyRevenue: RevenueData[] = [];

  addToDailyRevenue(date: string, amount: number) {
    this.dailyRevenue.push({ date, amount });
  }

  sendToAccounting(accounting: Accounting) {
    const todayRevenue = this.dailyRevenue.reduce((total, data) => total + data.amount, 0);
    accounting.updateRevenue(todayRevenue);
  }
}



class Payment {
  private amount: number;
    
  constructor(amount: number) {
    this.amount = amount;
  }
}
/*"Бухгалтерія":

    Відповідає за фінансове управління зоопарку.

    Розпоряджається бюджетом, включно з оплатою співробітників, закупівлею корму для тварин і обслуговуванням зоопарку.

    Зберігає дані про всіх співробітників, тварин і виплати.

    Можливість генерувати фінансові звіти.*/

interface FinancialManagement {
  generateFinancialReports(): void;
}
    
class Accounting implements FinancialManagement {
  private employees: Employee[] = [];
  private animals: Animal[] = [];
  private payments: Payment[] = [];
  private budget: number;
  private totalRevenue: number ;


  constructor() {
    this.employees = [];
    this.animals = [];
    this.payments = [];
    this.budget = 0;
    this.totalRevenue = 0;
  }
    
  // Метод для розрахунку загальних витрат
  private calculateTotalExpenses(): number{
    let totalExpenses = 0;

    // Розрахунок витрат на зарплати співробітників
    const salaries = this.employees.reduce((total, employee) => total + this.getSalary(employee), 0);

    // Розрахунок витрат на купівлю корму для тварин
    const foodExpenses = this.animals.reduce((total, animal) => total + this.getFoodExpense(animal), 0);

    totalExpenses = salaries + foodExpenses;

    return totalExpenses;
  }

  private getSalary(employee: Employee): number {
    return employee.getSalary();
  }

  private getFoodExpense(animal: Animal): number {
    return animal.getFoodExpense();
  }
  
  updateRevenue(amount: number) {
  this.totalRevenue += amount;
  }


  generateFinancialReports(): void {
    const totalExpenses = this.calculateTotalExpenses();
    const profit = this.totalRevenue - totalExpenses;

    console.log(`Total profit: ${this.totalRevenue}`);
    console.log(`General expenses: ${totalExpenses}`);
    console.log(`Profit: ${profit}`);
  }
}


/*"Адміністрація":

    Відповідає за управління співробітниками і тваринами.

    Може додавати і видаляти співробітників і тварин.

    Створює сповіщення про рекламні акції та інші важливі події в зоопарку.*/


class Administration {
  private employees: Employee[] = [];
  private animals: Animal[] = [];
  private promotions: string[] = [];

  getPromotions() {
    return this.promotions;
  }
    
  addEmployee(employee: Employee) {
    this.employees.push(employee);
  }
    
  removeEmployee(employee: Employee) {
    const index = this.employees.indexOf(employee);
    if (index !== -1) {
      this.employees.splice(index, 1);
    }
  }
    
  addAnimal(animal: Animal) {
    this.animals.push(animal);
  }
    
  removeAnimal(animal: Animal) {
    const index = this.animals.indexOf(animal);
    if (index !== -1) {
      this.animals.splice(index, 1);
    }
  }
    
  createPromotions() {
    this.promotions.push('Discount on entrance tickets on weekends!');
  }

}

/*"Тварини":

Включає в себе інформацію про кожну тварину, таку як вид, ім'я, вік, здоров'я 
та інші характеристики.*/
interface AnimalInfo {
  getSpecies(): string;
  getName(): string;
  getAge(): number;
  getHealth(): string;
  getFoodExpense(): number;
}

class Animal implements AnimalInfo {
  private species: string;
  private name: string;
  private age: number;
  private health: string;
  private foodExpense: number;

  constructor(species: string, name: string, age: number, health: string, foodExpense: number) {
    this.species = species;
    this.name = name;
    this.age = age;
    this.health = health;
    this.foodExpense = foodExpense;
  }

  getSpecies() {
    return this.species;
  }

  getName() {
    return this.name;
  }

  getAge() {
    return this.age;
  }

  getHealth() {
    return this.health;
  }
  getFoodExpense() {
    return this.foodExpense; 
  }
}



/*"Співробітники":

Каса і Адміністрація можуть додавати і видаляти співробітників.

Співробітники можуть мати різні посади та обов'язки, які слід враховувати.*/

class Employee implements Person {
  private name: string;
  private position: string;
  private contactInfo: string;
  private salary: number;

  constructor(name: string, position: string, contactInfo: string, salary: number) {
    this.name = name;
    this.position = position;
    this.contactInfo = contactInfo;
    this.salary = salary;
  }

  getName() {
    return this.name;
  }

  getPosition() {
    return this.position;
  }
  getContactInfo() {
    return this.contactInfo;
  }
  getSalary() {
    return this.salary; 
  }
}


/*"Бюджет":

Бухгалтерія розпоряджається бюджетом і стежить за фінансами зоопарку.

Можливість вести бюджетний облік і надавати фінансові звіти.*/
class Budget implements FinancialManagement {
  private amount: number;
  private animalsCost: number = 0;
  private employeeSalaries: number = 0;

  constructor(amount: number) {
    this.amount = amount;
  }

  manageBudget() {
    if (this.amount >= this.animalsCost + this.employeeSalaries) {
      console.log("The budget is large enough to keep animals and pay employees.");
    } else {
      console.log("The budget is insufficient for keeping animals and paying employees.");
    }
  }

  generateFinancialReports() {
    console.log(`Expenses for keeping animals: ${this.animalsCost}`);
    console.log(`Salaries to employees: ${this.employeeSalaries}`);
  }
  
  updateAnimalCost(cost: number) {
    this.animalsCost += cost;
  }
  updateEmployeeSalary(salary: number) {
    this.employeeSalaries += salary;
  }
}


// Create instances of required classes
const currentVisitors = new CurrentVisitors();
const advertisingDepartment = new AdvertisingDepartment();
const revenue = new Revenue();
const accounting = new Accounting();
const ticketOffice = new TicketOffice(currentVisitors, advertisingDepartment, revenue);

// Create a visitor
const visitor = new Visitor('Roman Dep', 'roman@example.com');

// Sell a ticket to the visitor
const ticketFactory = new TicketFactory();
const adultTicket = ticketFactory.createTicket('adult', 20);
ticketOffice.sellTicket(visitor, adultTicket);

// Notify visitors before closing
currentVisitors.notifyVisitorsBeforeClosing();

// Create a client for the advertising department
const client = new Client('RTY Company', 'info@rty.com');
ticketOffice.addClient(client);

// Send promotions to clients
advertisingDepartment.sendPromotions();

// Update revenue and send data to accounting
revenue.sendToAccounting(accounting);

// Generate financial reports
accounting.generateFinancialReports();

// Zoo administration actions
const administration = new Administration();
const employee = new Employee('Valya', 'Zookeeper', 'valya@example.com', 3000);
administration.addEmployee(employee);

const animal = new Animal('Zebra', 'Martin', 5, 'Good', 200);
administration.addAnimal(animal);

// Create promotions
administration.createPromotions();

// Get promotions
const promotions = administration.getPromotions();
console.log('Promotions:', promotions);

// Budget management
const budget = new Budget(5000);
budget.updateAnimalCost(200);
budget.updateEmployeeSalary(3000);
budget.manageBudget();
budget.generateFinancialReports();




