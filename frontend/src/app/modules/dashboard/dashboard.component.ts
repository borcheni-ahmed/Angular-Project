import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  kpis: any = {};
  displayKpis: any = { totalRevenue: 0, totalProfit: 0, totalOrders: 0, totalCustomers: 0 };
  trendChart: any;
  countryChart: any;
  productChart: any;
  currentTime = '';
  currentDate = '';
  username = '';
  clockInterval: any;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername?.() || 'User';
    this.startClock();
    this.loadKPIs();
    this.loadTrendChart();
    this.loadCountryChart();
    this.loadProductChart();
  }

  ngOnDestroy() {
    clearInterval(this.clockInterval);
  }

  startClock() {
    const update = () => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.currentDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    update();
    this.clockInterval = setInterval(update, 1000);
  }

  animateCounter(key: string, target: number) {
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      this.displayKpis[key] = Math.floor(current);
    }, duration / steps);
  }

  loadKPIs() {
    this.analyticsService.getKPIs().subscribe(data => {
      this.kpis = data;
      this.animateCounter('totalRevenue', data.totalRevenue);
      this.animateCounter('totalProfit', data.totalProfit);
      this.animateCounter('totalOrders', data.totalOrders);
      this.animateCounter('totalCustomers', data.totalCustomers);
    });
  }

  loadTrendChart() {
    this.analyticsService.getSalesTrend(12).subscribe(data => {
      const labels = data.map((d: any) => d.period);
      const revenue = data.map((d: any) => d.revenue);
      this.trendChart = new Chart('trendChart', {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Revenue',
            data: revenue,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 4,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { size: 12 } } }
          },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }
          }
        }
      });
    });
  }

  loadCountryChart() {
    this.analyticsService.getSalesByCountry().subscribe(data => {
      const labels = data.map((d: any) => d.country);
      const revenue = data.map((d: any) => d.totalRevenue);
      this.countryChart = new Chart('countryChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Revenue by Country',
            data: revenue,
            backgroundColor: 'rgba(99,102,241,0.7)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#94a3b8' } }
          },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }
          }
        }
      });
    });
  }

  loadProductChart() {
    this.analyticsService.getSalesByProduct(6).subscribe(data => {
      const labels = data.map((d: any) => d.productName);
      const revenue = data.map((d: any) => d.totalRevenue);
      this.productChart = new Chart('productChart', {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: revenue,
            backgroundColor: ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f59e0b'],
            borderColor: 'rgba(15,23,42,0.8)',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { size: 11 } } }
          }
        }
      });
    });
  }
}
