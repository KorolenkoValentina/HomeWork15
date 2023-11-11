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
class TicketFactory {
  createTicket(type: string, cost: number): Ticket {
    switch(type) {
      case 'adult':
        return new AdultTicket(cost);
      case 'child':
        return new ChildTicket(cost);
      case 'family':
        return new FamilyTicket(cost);
      default:
        throw new Error('Invalid ticket type');
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
    console.log(`Отримано повідомлення: ${message}`);
  }
}

class CurrentVisitors {
  private observers: Observer[] = [];

  addVisitor(visitor: Visitor) {
    this.observers.push(visitor);
  }

  notifyVisitorsBeforeClosing() {
    this.observers.forEach(observer => {
      observer.update("Зоопарк закривається через 15 хвилин.");
    });
  }

  notifyVisitorsBeforeLeaving() {
    this.observers.forEach(observer => {
      observer.update("Зоопарк зараз закриється. Дякуємо за відвідування!");
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
    // Додати виручку до денної виручки
    this.revenue.addToDailyRevenue(new Date().toISOString(), cost);
    // Додати відвідувача до списку поточних відвідувачів
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
      console.log(`Розсилка рекламної акції клієнту ${client.getName()} на адресу ${client.getContactInfo()}`);
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
  private calculateTotalExpenses(): number {
    let totalExpenses = 0;

    // Розрахунок витрат на зарплати співробітників
    const salaries = this.employees.reduce((total, employee) => total + this.getSalary(employee), 0);

    // Розрахунок витрат на купівлю корму для тварин
    const foodExpenses = this.animals.reduce((total, animal) => total + this.getFoodExpense(animal), 0);

    // Інші можливі витрати...

    // Додавання всіх розрахунків до загальних витрат
    totalExpenses = salaries + foodExpenses;

    return totalExpenses;
  }

  private getSalary(employee: Employee): number {
    return employee.getSalary();
  }

  private getFoodExpense(animal: Animal): number {
    return animal.getFoodExpense();
  }
  // Метод для оновлення загального доходу
  updateRevenue(amount: number) {
  this.totalRevenue += amount;
  }


  generateFinancialReports() {
    // Ваша логіка для генерації фінансових звітів
    const totalExpenses = this.calculateTotalExpenses();
    const profit = this.totalRevenue - totalExpenses;

    console.log(`Загальний прибуток: ${this.totalRevenue}`);
    console.log(`Загальні витрати: ${totalExpenses}`);
    console.log(`Прибуток: ${profit}`);
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
    this.promotions.push('Знижка на вхідні квитки у вихідні!');
  }

}

/*"Тварини":

Включає в себе інформацію про кожну тварину, таку як вид, ім'я, вік, здоров'я та інші характеристики.*/
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
      console.log("Бюджет досить великий для утримання тварин та виплат співробітникам.");
    } else {
      console.log("Бюджет недостатній для утримання тварин та виплат співробітникам.");
    }
  }

  generateFinancialReports() {
    console.log(`Витрати на утримання тварин: ${this.animalsCost}`);
    console.log(`Зарплати співробітникам: ${this.employeeSalaries}`);
  }
  
  updateAnimalCost(cost: number) {
    this.animalsCost += cost;
  }
  updateEmployeeSalary(salary: number) {
    this.employeeSalaries += salary;
  }
}



