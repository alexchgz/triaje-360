import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddNewProductModalComponent } from './add-new-product-modal/add-new-product-modal.component';
import { ListPageHeaderComponent } from './list-page-header/list-page-header.component';
import { ProfileUserSocialComponent } from './profile-user-social/profile-user-social.component';
import { ProfilePhotosComponent } from './profile-photos/profile-photos.component';
import { ProfileWhoToFollowComponent } from './profile-who-to-follow/profile-who-to-follow.component';
import { ProfileRecentPostsComponent } from './profile-recent-posts/profile-recent-posts.component';
import { ComponentsPagesModule } from '../../components/pages/components.pages.module';
import { ProfilePostsComponent } from './profile-posts/profile-posts.component';
import { ProfileGalleryComponent } from './profile-gallery/profile-gallery.component';
import { ProfileFriendsComponent } from './profile-friends/profile-friends.component';
import { ProfileUserPortfolioComponent } from './profile-user-portfolio/profile-user-portfolio.component';
import { ProfileProcessComponent } from './profile-process/profile-process.component';
import { ComponentsCardsModule } from '../../components/cards/components.cards.module';
import { ProfilePortfolioItemsComponent } from './profile-portfolio-items/profile-portfolio-items.component';
import { BlogSideVideoComponent } from './blog-side-video/blog-side-video.component';
import { BlogCategoriesComponent } from './blog-categories/blog-categories.component';
import { BlogContentComponent } from './blog-content/blog-content.component';
import { FeatureComparisonComponent } from './feature-comparison/feature-comparison.component';
import { ComponentsPlayerModule } from 'src/app/components/player/components.player.module';
import { LayoutContainersModule } from '../layout/layout.containers.module';
import { ProductDetailInfoAltComponent } from './product-detail-info-alt/product-detail-info-alt.component';
import { ProductDetailOrdersComponent } from './product-detail-orders/product-detail-orders.component';
import { ProductDetailCommentsComponent } from './product-detail-comments/product-detail-comments.component';
import { ProductDetailInfoComponent } from './product-detail-info/product-detail-info.component';
import { ProductDetailTabsComponent } from './product-detail-tabs/product-detail-tabs.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AddNewUserModalComponent } from './add-new-user-modal/add-new-user-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddNewSchoolYearModalComponent } from './add-new-school-year-modal/add-new-school-year-modal.component';
import { AddNewSubjectModalComponent } from './add-new-subject-modal/add-new-subject-modal.component';
import { ManageSubjectModalComponent } from './manage-subject-modal/manage-subject-modal.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ShowStudentRegisterModalComponent } from './show-student-register-modal/show-student-register-modal.component';
import { SelectPatientImgModalComponent } from './select-patient-img-modal/select-patient-img-modal.component';


@NgModule({
  declarations: [
    AddNewProductModalComponent,
    ListPageHeaderComponent,
    ProfileUserSocialComponent,
    ProfilePhotosComponent,
    ProfileWhoToFollowComponent,
    ProfileRecentPostsComponent,
    ProfilePostsComponent,
    ProfileGalleryComponent,
    ProfileFriendsComponent,
    ProfileUserPortfolioComponent,
    ProfileProcessComponent,
    ProfilePortfolioItemsComponent,
    BlogSideVideoComponent,
    BlogCategoriesComponent,
    BlogContentComponent,
    FeatureComparisonComponent,
    ProductDetailInfoAltComponent,
    ProductDetailOrdersComponent,
    ProductDetailCommentsComponent,
    ProductDetailInfoComponent,
    ProductDetailTabsComponent,
    AddNewUserModalComponent,
    AddNewSchoolYearModalComponent,
    AddNewSubjectModalComponent,
    ManageSubjectModalComponent,
    ShowStudentRegisterModalComponent,
    SelectPatientImgModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    LayoutContainersModule,
    NgSelectModule,
    LightboxModule,
    ComponentsPagesModule,
    ComponentsCardsModule,
    ComponentsPlayerModule,
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [
    AddNewProductModalComponent,
    AddNewUserModalComponent,
    AddNewSchoolYearModalComponent,
    AddNewSubjectModalComponent,
    ManageSubjectModalComponent,
    ListPageHeaderComponent,
    ProfileUserSocialComponent,
    ProfilePhotosComponent,
    ProfileWhoToFollowComponent,
    ProfileRecentPostsComponent,
    ProfilePostsComponent,
    ProfileGalleryComponent,
    ProfileFriendsComponent,
    ProfileUserPortfolioComponent,
    ProfileProcessComponent,
    ProfilePortfolioItemsComponent,
    BlogSideVideoComponent,
    BlogCategoriesComponent,
    BlogContentComponent,
    FeatureComparisonComponent,
    ProductDetailInfoAltComponent,
    ProductDetailOrdersComponent,
    ProductDetailCommentsComponent,
    ProductDetailInfoComponent,
    ProductDetailTabsComponent,
    ShowStudentRegisterModalComponent,
    SelectPatientImgModalComponent
  ]
})
export class PagesContainersModule { }
