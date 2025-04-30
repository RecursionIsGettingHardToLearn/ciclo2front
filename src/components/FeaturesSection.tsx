import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { School, BookOpen, Users, Award } from 'lucide-react'

const features = [
  {
    icon: <School className="w-12 h-12 text-primary" />,
    title: "Infraestructura Moderna",
    description: "Aulas equipadas con tecnología de última generación"
  },
  {
    icon: <BookOpen className="w-12 h-12 text-primary" />,
    title: "Excelencia Académica",
    description: "Programas educativos certificados internacionalmente"
  },
  {
    icon: <Users className="w-12 h-12 text-primary" />,
    title: "Formación Integral",
    description: "Actividades deportivas, artísticas y culturales"
  },
  {
    icon: <Award className="w-12 h-12 text-primary" />,
    title: "Alto Nivel Docente",
    description: "Profesores con amplia experiencia y certificaciones"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-16">Nuestros Pilares Educativos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle className="text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}