export interface Car {
  id: string
  brand: "Fiat" | "Geely" | "Livan" | "Terrsam"
  model: string
  year: number
  fuelType: string
  transmission: string
  seats: number
  price: number
  monthlyPayment: number
  image: string
}

export interface Registration {
  id: string
  fullName: string
  nin: string
  cardLast8: string
  cardExpiry: string
  phone1: string
  phone2?: string
  hasPreviousInstallment: boolean
  selectedCarId: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

export const cars: Car[] = [
  {
    id: "fiat-tipo",
    brand: "Fiat",
    model: "Tipo",
    year: 2025,
    fuelType: "بنزين",
    transmission: "يدوي",
    seats: 5,
    price: 3200000,
    monthlyPayment: 17500,
    image: "/cars/fiat-tipo.jpg"
  },
  {
    id: "fiat-500",
    brand: "Fiat",
    model: "500",
    year: 2025,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    seats: 4,
    price: 2800000,
    monthlyPayment: 18500,
    image: "/cars/fiat-500.jpg"
  },
  {
    id: "fiat-doblo",
    brand: "Fiat",
    model: "Doblo",
    year: 2025,
    fuelType: "ديزل",
    transmission: "يدوي",
    seats: 5,
    price: 3500000,
    monthlyPayment: 23000,
    image: "/cars/fiat-doblo.jpg"
  },
  {
    id: "fiat-doblo-panorama",
    brand: "Fiat",
    model: "Doblo Panorama",
    year: 2025,
    fuelType: "ديزل",
    transmission: "يدوي",
    seats: 7,
    price: 3800000,
    monthlyPayment: 25000,
    image: "/cars/fiat-doblo-panorama.jpg"
  },
  {
    id: "fiat-panda",
    brand: "Fiat",
    model: "Panda",
    year: 2025,
    fuelType: "بنزين",
    transmission: "يدوي",
    seats: 5,
    price: 2400000,
    monthlyPayment: 16000,
    image: "/cars/fiat-panda.jpg"
  },
  {
    id: "geely-emgrand",
    brand: "Geely",
    model: "Emgrand",
    year: 2025,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    seats: 5,
    price: 3000000,
    monthlyPayment: 20000,
    image: "/cars/geely-emgrand.jpg"
  },
  {
    id: "geely-coolray",
    brand: "Geely",
    model: "Coolray",
    year: 2025,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    seats: 5,
    price: 3800000,
    monthlyPayment: 25000,
    image: "/cars/geely-coolray.jpg"
  },
  {
    id: "geely-azkarra",
    brand: "Geely",
    model: "Azkarra",
    year: 2025,
    fuelType: "هجين",
    transmission: "أوتوماتيك",
    seats: 5,
    price: 4500000,
    monthlyPayment: 29500,
    image: "/cars/geely-azkarra.jpg"
  },
  {
    id: "livan-x3-pro",
    brand: "Livan",
    model: "X3 PRO",
    year: 2025,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    seats: 5,
    price: 2000000,
    monthlyPayment: 13000,
    image: "/cars/livan-x3-pro.jpg"
  },
  {
    id: "terrsam-single-cabin",
    brand: "Terrsam",
    model: "شاحنة كابينة واحدة",
    year: 2025,
    fuelType: "ديزل",
    transmission: "يدوي",
    seats: 3,
    price: 1850000,
    monthlyPayment: 12000,
    image: "/cars/terrsam-single.jpg"
  },
  {
    id: "terrsam-double-cabin",
    brand: "Terrsam",
    model: "شاحنة كابينة مزدوجة",
    year: 2025,
    fuelType: "ديزل",
    transmission: "يدوي",
    seats: 6,
    price: 2000000,
    monthlyPayment: 13000,
    image: "/cars/terrsam-double.jpg"
  }
]

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ar-DZ').format(price) + ' د.ج'
}
