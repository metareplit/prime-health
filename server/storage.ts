import {
  type Service,
  type Patient,
  type Appointment,
  type User,
  type InsertService,
  type InsertPatient,
  type InsertAppointment,
  type InsertUser,
} from "@shared/schema";

export interface IStorage {
  // Services
  getServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Patients
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  
  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private services: Map<number, Service>;
  private patients: Map<number, Patient>;
  private appointments: Map<number, Appointment>;
  private users: Map<number, User>;
  private currentId: { [key: string]: number };

  constructor() {
    this.services = new Map();
    this.patients = new Map();
    this.appointments = new Map();
    this.users = new Map();
    this.currentId = {
      services: 1,
      patients: 1,
      appointments: 1,
      users: 1,
    };

    // Initialize with default services
    const defaultServices = [
      {
        id: this.currentId.services++,
        name: "Saç Ekimi",
        description: "Modern FUE tekniği ile doğal görünümlü saç ekimi",
        imageUrl: "/images/hair-transplant.svg",
        slug: "sac-ekimi",
      },
      {
        id: this.currentId.services++,
        name: "Sakal Ekimi",
        description: "Kalıcı ve doğal görünümlü sakal ekimi",
        imageUrl: "/images/beard-transplant.svg",
        slug: "sakal-ekimi",
      },
      // Add other services...
    ];

    defaultServices.forEach(service => this.services.set(service.id, service));
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find(s => s.slug === slug);
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.currentId.services++;
    const newService = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const id = this.currentId.patients++;
    const newPatient = { ...patient, id };
    this.patients.set(id, newPatient);
    return newPatient;
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId.appointments++;
    const newAppointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) throw new Error("Appointment not found");
    
    const updatedAppointment = { ...appointment, status };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();
