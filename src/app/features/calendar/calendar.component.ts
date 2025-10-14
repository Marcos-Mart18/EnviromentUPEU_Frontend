import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  calendarDays: CalendarDay[] = [];
  daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  showEventModal = false;
  selectedEvent: CalendarEvent | null = null;

  // Eventos de ejemplo
  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Clase de Matemáticas',
      description: 'Examen parcial de cálculo diferencial',
      date: '2024-12-15',
      time: '08:00 - 10:00',
      color: '#3B82F6'
    },
    {
      id: '2',
      title: 'Reunión de Facultad',
      description: 'Revisión de plan de estudios',
      date: '2024-12-18',
      time: '14:00 - 16:00',
      color: '#10B981'
    },
    {
      id: '3',
      title: 'Entrega de Proyectos',
      description: 'Fecha límite para proyectos finales',
      date: '2024-12-20',
      time: '23:59',
      color: '#F59E0B'
    },
    {
      id: '4',
      title: 'Vacaciones de Navidad',
      description: 'Inicio de vacaciones navideñas',
      date: '2024-12-23',
      time: 'Todo el día',
      color: '#EF4444'
    },
    {
      id: '5',
      title: 'Navidad',
      description: 'Día festivo',
      date: '2024-12-25',
      time: 'Todo el día',
      color: '#8B5CF6'
    }
  ];

  ngOnInit() {
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return this.monthNames[this.currentMonth];
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const today = new Date();
    const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEvents = this.getEventsForDate(date);
      const isToday = isCurrentMonth && date.getDate() === today.getDate();

      this.calendarDays.push({
        date: date.getDate(),
        isCurrentMonth: date.getMonth() === this.currentMonth,
        isToday: isToday,
        events: dayEvents
      });
    }
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    const dateString = this.formatDate(date);
    return this.events.filter(event => event.date === dateString);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  getDayClasses(day: CalendarDay): string {
    let classes = 'group';
    if (!day.isCurrentMonth) {
      classes += ' bg-gray-50 text-gray-400';
    }
    if (day.isToday) {
      classes += ' bg-blue-50';
    }
    return classes;
  }

  getDateClasses(day: CalendarDay): string {
    let classes = '';
    if (day.isToday) {
      classes = 'text-blue-600 font-bold';
    } else if (day.isCurrentMonth) {
      classes = 'text-gray-900';
    } else {
      classes = 'text-gray-400';
    }
    return classes;
  }

  getTextColor(backgroundColor: string): string {
    // Convertir hex a RGB para determinar si usar texto claro u oscuro
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  addEvent(day: CalendarDay) {
    // Aquí podrías abrir un modal para agregar un evento
    console.log('Agregar evento para el día:', day.date);
  }

  viewEvent(event: CalendarEvent) {
    this.selectedEvent = event;
    this.showEventModal = true;
  }

  viewMoreEvents(day: CalendarDay) {
    console.log('Ver más eventos para el día:', day.date);
  }

  closeEventModal() {
    this.showEventModal = false;
    this.selectedEvent = null;
  }
}