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

    // Detaylı hizmet bilgileri
    const defaultServices = [
      {
        id: this.currentId.services++,
        name: "Saç Ekimi",
        description: "Modern FUE ve DHI teknikleriyle doğal görünümlü saç ekimi",
        longDescription: "Safir FUE ve DHI teknikleri kullanılarak yapılan saç ekimi operasyonları, maksimum greft sayısı ve doğal görünüm sağlar. Deneyimli ekibimiz, kişiye özel planlama ile en uygun tekniği belirler. Gürcistan'ın modern kliniklerinde, en son teknoloji ve steril ortamda gerçekleştirilen işlemlerle kalıcı sonuçlar elde edilir.",
        benefits: [
          "Kalıcı ve doğal sonuçlar",
          "Minimum iyileşme süresi",
          "Lokal anestezi ile ağrısız işlem",
          "Yüksek başarı oranı",
          "Maksimum greft verimi",
          "Kişiye özel tasarım",
          "Sıfır iz teknolojisi",
          "Hızlı iyileşme süreci"
        ],
        process: [
          "Ücretsiz online konsültasyon",
          "Detaylı saç analizi",
          "Saç çizgisi ve ekim planı tasarımı",
          "Kan testleri ve sağlık kontrolü",
          "Lokal anestezi uygulaması",
          "Greft toplama işlemi",
          "Kanal açma ve greft yerleştirme",
          "Post-operatif bakım talimatları",
          "1 yıl boyunca düzenli takip"
        ],
        faqs: [
          "Saç ekimi kalıcı mıdır?|Evet, saç ekimi kalıcı bir çözümdür. Ekilen saçlar genetik olarak dökülmeye dirençli bölgeden alındığı için ömür boyu kalıcıdır.",
          "İşlem ne kadar sürer?|Ortalama 6-8 saat sürer. Bu süre ekilecek greft sayısına göre değişebilir.",
          "Ne zaman sonuç alırım?|İlk sonuçlar 6. ayda görülmeye başlar, tam sonuç 12-15 ay içinde alınır. Her hasta için iyileşme süreci farklılık gösterebilir.",
          "İşlem acı verir mi?|Lokal anestezi sayesinde işlem sırasında acı hissetmezsiniz. İşlem sonrası hafif bir gerginlik hissi olabilir.",
          "İşlem sonrası günlük hayatıma ne zaman dönebilirim?|İşlemden 3 gün sonra günlük aktivitelerinize dönebilirsiniz. Spor ve ağır aktiviteler için 1 ay beklemeniz önerilir.",
          "Ekilen saçlar dökülür mü?|İşlemden 2-3 hafta sonra ekilen saçlar dökülür, bu normal bir süreçtir. 3-4 ay sonra yeni saçlar çıkmaya başlar."
        ],
        duration: "6-8 saat",
        imageUrl: "https://images.unsplash.com/photo-1621789098261-b7a3b15ae244",
        slug: "sac-ekimi"
      },
      {
        id: this.currentId.services++,
        name: "Sakal Ekimi",
        description: "Kalıcı ve doğal görünümlü sakal ekimi",
        longDescription: "Sakal ekimi, yüz bölgesinde seyrek veya hiç sakal çıkmayan alanlara FUE tekniği ile sakal kılı ekimi yapılmasıdır. En son teknoloji ve uzman kadromuzla doğal ve kalıcı sonuçlar elde edilir. Kişiye özel planlama ile yüz yapınıza en uygun sakal tasarımı yapılır.",
        benefits: [
          "Kalıcı çözüm",
          "Doğal görünüm",
          "Hızlı iyileşme",
          "Minimal iz",
          "Kişiye özel tasarım",
          "Tek seansta tamamlama",
          "Lokal anestezi ile ağrısız işlem",
          "Yüksek başarı oranı"
        ],
        process: [
          "Ücretsiz konsültasyon",
          "Yüz analizi ve planlama",
          "Sakal tasarımı",
          "Donör alan hazırlığı",
          "Lokal anestezi",
          "Greft toplama",
          "Kanal açma ve yerleştirme",
          "Bakım önerileri",
          "6 ay boyunca takip"
        ],
        faqs: [
          "Sakal ekimi kalıcı mıdır?|Evet, ömür boyu kalıcıdır. Ekilen kıllar genetik olarak dökülmeye dirençlidir.",
          "Sonuçlar ne zaman görülür?|İlk sonuçlar 3. ayda görülür, tam sonuç 6-8 ayda alınır.",
          "Günlük yaşama ne zaman dönebilirim?|2-3 gün içinde normal yaşamınıza dönebilirsiniz.",
          "İşlem izi kalır mı?|Kullanılan modern teknikler sayesinde gözle görülür iz kalmaz.",
          "Ekilen sakallar normal sakal gibi uzar mı?|Evet, ekilen sakallar doğal sakallar gibi uzar ve şekil verilebilir."
        ],
        duration: "4-6 saat",
        imageUrl: "https://images.unsplash.com/photo-1600845264496-786c8c6a7b50",
        slug: "sakal-ekimi"
      },
      {
        id: this.currentId.services++,
        name: "Kaş Ekimi",
        description: "Kalıcı ve doğal görünümlü kaş ekimi",
        longDescription: "Kaş ekimi, seyrek veya şekli bozuk kaşların DHI tekniği ile yeniden şekillendirilmesidir. Her kaş teli için özel açı ve yön belirlenerek doğal bir görünüm elde edilir. Yüz hatlarınıza uygun kaş tasarımı ile dengeli ve estetik bir görünüm sağlanır.",
        benefits: [
          "Kalıcı sonuç",
          "Doğal görünüm",
          "Minimal travma",
          "Hızlı iyileşme",
          "Kişiye özel tasarım",
          "İz bırakmayan teknik",
          "Tek seansta uygulama"
        ],
        process: [
          "Detaylı yüz analizi",
          "Kaş tasarımı",
          "Donör alan seçimi",
          "Lokal anestezi",
          "DHI tekniği ile ekim",
          "Bakım talimatları",
          "3 ay takip"
        ],
        faqs: [
          "Kaş ekimi kalıcı mıdır?|Evet, kaş ekimi kalıcı bir çözümdür.",
          "İşlem ne kadar sürer?|Ortalama 2-3 saat sürer.",
          "Sonuçlar ne zaman görülür?|İlk sonuçlar 2. ayda görülmeye başlar, tam sonuç 6 ayda alınır.",
          "Kaşlarım doğal görünecek mi?|Evet, DHI tekniği sayesinde her kıl doğal açı ve yönde ekilir."
        ],
        duration: "2-3 saat",
        imageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec",
        slug: "kas-ekimi"
      },
      {
        id: this.currentId.services++,
        name: "PRP Tedavisi",
        description: "Kişinin kendi kanından elde edilen plazma ile saç güçlendirme",
        longDescription: "PRP (Platelet Rich Plasma) tedavisi, kişinin kendi kanından elde edilen trombositten zengin plazmanın saç köklerine enjekte edilmesidir. Bu yöntem saç dökülmesini yavaşlatır, mevcut saçları güçlendirir ve yeni saç çıkışını uyarır. Doğal ve güvenli bir tedavi yöntemidir.",
        benefits: [
          "Doğal tedavi yöntemi",
          "Hızlı uygulama",
          "Yan etki riski minimal",
          "Saç kalitesinde artış",
          "Dökülmelerde azalma",
          "Saç köklerinde canlanma"
        ],
        process: [
          "Kan alımı",
          "Plazma ayrıştırma",
          "Saç derisi temizliği",
          "PRP enjeksiyonu",
          "Saç bakım önerileri",
          "Periyodik kontrol"
        ],
        faqs: [
          "PRP tedavisi ağrılı mıdır?|Lokal anestezi kremi ile ağrısız uygulama yapılır.",
          "Kaç seans gerekir?|Genellikle 4-6 seans önerilir, ayda bir uygulama yapılır.",
          "Sonuçlar ne zaman görülür?|İlk sonuçlar 2-3 ay içinde görülmeye başlar.",
          "Tedavi kimlere uygulanabilir?|Saç dökülmesi yaşayan ve saçlarını güçlendirmek isteyen herkese uygulanabilir."
        ],
        duration: "30-45 dakika",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
        slug: "prp-tedavisi"
      },
      {
        id: this.currentId.services++,
        name: "Mezoterapi",
        description: "Vitamini ve mineral takviyesi ile saç güçlendirme tedavisi",
        longDescription: "Saç mezoterapisi, saç köklerinin ihtiyaç duyduğu vitamin, mineral ve amino asitlerin doğrudan saç derisine enjekte edilmesidir. Bu yöntem saç dökülmesini önler, saç kalitesini artırır ve yeni saç çıkışını destekler. Kişiye özel formüllerle en etkili sonuç hedeflenir.",
        benefits: [
          "Hızlı etki",
          "Doğrudan etki alanına uygulama",
          "Saç kalitesinde artış",
          "Dökülmelerde azalma",
          "Saç köklerinde beslenme",
          "Uzun süreli etki"
        ],
        process: [
          "Saç analizi",
          "Formül belirleme",
          "Saç derisi temizliği",
          "Mezoterapi uygulaması",
          "Bakım önerileri",
          "Düzenli kontrol"
        ],
        faqs: [
          "Mezoterapi ağrılı mıdır?|Anestezik krem ile ağrısız uygulama yapılır.",
          "Kaç seans uygulanır?|Genellikle 6-8 seans, haftada bir uygulama yapılır.",
          "Sonuçlar kalıcı mıdır?|Düzenli bakım ile kalıcı sonuçlar elde edilir.",
          "İşlem sonrası günlük hayata dönüş?|İşlem sonrası hemen günlük hayata dönülebilir."
        ],
        duration: "45-60 dakika",
        imageUrl: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0",
        slug: "mezoterapi"
      }
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