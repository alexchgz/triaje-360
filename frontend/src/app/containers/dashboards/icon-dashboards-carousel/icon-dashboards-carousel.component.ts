import { Component, OnInit } from '@angular/core';
import { GlideComponent } from 'src/app/components/carousel/glide/glide.component';

interface IIconCardItem {
  title: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-icon-dashboards-carousel',
  templateUrl: './icon-dashboards-carousel.component.html',
  styleUrls: ['./icon-dashboards-carousel.component.scss']
})
export class IconDashboardsCarouselComponent {
  data: IIconCardItem[] = [
    { title: 'dashboards.schoolYears', icon: 'iconsminds-digital-drawing', url: '/app/dashboards/all/school-years/data-list' },
    { title: 'dashboards.subjects', icon: 'iconsminds-air-balloon-1', url: '/app/dashboards/all/subjects/data-list' },
    { title: 'dashboards.users', icon: 'iconsminds-pantone', url: '/app/dashboards/all/users/data-list' },
    // { title: 'dashboards.exercises', icon: 'iconsminds-library', url: '/app/dashboards/all/exercises/data-list' }
  ];

  constructor() { }

}
