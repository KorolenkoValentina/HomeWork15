import {
    Ticket,
    AdultTicket,
    ChildTicket,
    FamilyTicket,
    TicketFactory,
    Person,
    Observer,
    Visitor,
    CurrentVisitors,
    Client,
    TicketOffice,
    Department,
    AdvertisingDepartment,
    Revenue,
    RevenueData,
    Payment,
    FinancialManagement,
    Accounting,
    AnimalInfo,
    Animal,
    Employee,
    Administration,
    Budget,
} from '../src/index';

describe('Ticket Classes', () => {
  test('AdultTicket should return correct cost', () => {
    const adultTicket = new AdultTicket(20);
    expect(adultTicket.getCost()).toBe(20);
  });
  
  test('ChildTicket should return correct cost', () => {
    const childTicket = new ChildTicket(10);
    expect(childTicket.getCost()).toBe(10);
  });
  
  test('FamilyTicket should return correct cost', () => {
    const familyTicket = new FamilyTicket(50);
    expect(familyTicket.getCost()).toBe(50);
  });
  
  test('TicketFactory should create AdultTicket', () => {
    const ticketFactory = new TicketFactory();
    const adultTicket = ticketFactory.createTicket('adult', 20);
    expect(adultTicket instanceof AdultTicket).toBe(true);
  });
  
  test('TicketFactory should throw error for invalid ticket type', () => {
    const ticketFactory = new TicketFactory();
    expect(() => ticketFactory.createTicket('invalid', 20)).toThrow('Invalid ticket type');
  });
});
  
describe('CurrentVisitors', () => {
  test('addVisitor should add a visitor', () => {
    const currentVisitors = new CurrentVisitors();
    const visitor = new Visitor('John Doe', 'john@example.com');
    currentVisitors.addVisitor(visitor);
    expect(currentVisitors['observers']).toContain(visitor);
  });
  
  test('notifyVisitorsBeforeClosing should notify visitors', () => {
    const currentVisitors = new CurrentVisitors();
    const visitor = new Visitor('John Doe', 'john@example.com');
    currentVisitors.addVisitor(visitor);
    const spyUpdate = jest.spyOn(visitor, 'update');
    currentVisitors.notifyVisitorsBeforeClosing();
    expect(spyUpdate).toHaveBeenCalledWith('Зоопарк закривається через 15 хвилин.');
  });
  
  test('notifyVisitorsBeforeLeaving should notify visitors', () => {
    const currentVisitors = new CurrentVisitors();
    const visitor = new Visitor('John Doe', 'john@example.com');
    currentVisitors.addVisitor(visitor);
    const spyUpdate = jest.spyOn(visitor, 'update');
    currentVisitors.notifyVisitorsBeforeLeaving();
    expect(spyUpdate).toHaveBeenCalledWith('Зоопарк зараз закриється. Дякуємо за відвідування!');
  });
});
  
describe('AdvertisingDepartment', () => {
  test('addClient should add a client', () => {
    const advertisingDepartment = new AdvertisingDepartment();
    const client = new Client('Jane Doe', 'jane@example.com');
    advertisingDepartment.addClient(client);
    expect(advertisingDepartment['clients']).toContain(client);
  });
  
  test('sendPromotions should send promotions to clients', () => {
    const advertisingDepartment = new AdvertisingDepartment();
    const client = new Client('Jane Doe', 'jane@example.com');
    advertisingDepartment.addClient(client);
    const spyConsoleLog = jest.spyOn(console, 'log');
    advertisingDepartment.sendPromotions();
    expect(spyConsoleLog).toHaveBeenCalledWith(`Розсилка рекламної акції клієнту Jane Doe на адресу jane@example.com`);
  });
});
  
describe('TicketOffice', () => {
  test('sellTicket should add visitor to current visitors', () => {
    const currentVisitors = new CurrentVisitors();
    const advertisingDepartment = new AdvertisingDepartment();
    const revenue = new Revenue();
    const ticketOffice = new TicketOffice(currentVisitors, advertisingDepartment, revenue);
    const visitor = new Visitor('John Doe', 'john@example.com');
    const adultTicket = new AdultTicket(20);
  
    ticketOffice.sellTicket(visitor, adultTicket);
  
    expect(currentVisitors['observers']).toContain(visitor);
  });
  
  test('addClient should add client to advertising department', () => {
    const currentVisitors = new CurrentVisitors();
    const advertisingDepartment = new AdvertisingDepartment();
    const revenue = new Revenue();
    const ticketOffice = new TicketOffice(currentVisitors, advertisingDepartment, revenue);
    const client = new Client('Jane Doe', 'jane@example.com');
  
    ticketOffice.addClient(client);
  
    expect(advertisingDepartment['clients']).toContain(client);
  });
});

describe('Revenue', () => {
  test('addToDailyRevenue should add revenue data', () => {
    const revenue = new Revenue();
    revenue.addToDailyRevenue('2023-11-11', 100);
    expect(revenue['dailyRevenue']).toContainEqual({ date: '2023-11-11', amount: 100 });
  });

  test('sendToAccounting should update total revenue in accounting', () => {
    const revenue = new Revenue();
    const accounting = new Accounting();
    const spyUpdateRevenue = jest.spyOn(accounting, 'updateRevenue');
    revenue.addToDailyRevenue('2023-11-11', 100);
    revenue.sendToAccounting(accounting);
    expect(spyUpdateRevenue).toHaveBeenCalledWith(100);
  });
});



describe('Administration', () => {
  test('createPromotions should add a promotion', () => {
    const administration = new Administration();
    administration.createPromotions();
    expect(administration['promotions']).toContain('Знижка на вхідні квитки у вихідні!');
  });
});

describe('Budget', () => {
  test('manageBudget should log a message based on budget status', () => {
    const budget = new Budget(10000);
    const spyConsoleLog = jest.spyOn(console, 'log');
    budget.updateAnimalCost(5000);
    budget.updateEmployeeSalary(6000);
    budget.manageBudget();
    // Add assertions based on the expected output or format of your budget management log
    expect(spyConsoleLog).toHaveBeenCalled();
  });

  test('generateFinancialReports should log correct financial reports', () => {
    const budget = new Budget(10000);
    const spyConsoleLog = jest.spyOn(console, 'log');
    budget.generateFinancialReports();
    // Add assertions based on the expected output or format of your financial reports
    expect(spyConsoleLog).toHaveBeenCalled();
  });
});
  
  