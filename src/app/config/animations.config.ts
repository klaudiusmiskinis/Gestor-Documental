import { animate, style, transition, trigger } from '@angular/animations';

export const slideIn =  [
/* SlideInLeft */
trigger('slideInLeft', [
    transition('void => *', [
      style({
        opacity: '0',
        transform: 'translateX(-100%)'
      }),
      animate('1000ms ease')
    ]),
  ]),

/* SlideInRight */
trigger('slideInRight', [
    transition('void => *', [
      style({
        opacity: '0',
        transform: 'translateX(100%)'
      }),
      animate('1000ms ease')
    ]),
  ]),

  /* SlideInDown */
  trigger('slideInDown', [
    transition('void => *', [
      style({
        opacity: '0',
        transform: 'translateY(-100%)'
      }),
      animate('1000ms ease')
    ]),
  ]),

  /* SlideInUp */
  trigger('slideInUp', [
    transition('void => *', [
      style({
        opacity: '0',
        transform: 'translateY(100%)'
      }),
      animate('1000ms ease')
    ]),
  ]),
]

export const fadeIn = trigger("fadeIn", [
  transition(":enter", [
    style({ opacity: 0 }),
    animate(
      "750ms ease-in-out",
      style({ opacity: 1 })
    )
  ]),
  transition(":leave", [
    style({ opacity: 1 }),
    animate(
      "600ms ease-in-out",
      style({ opacity: 0 })
    )
  ])
]);

export const fadeInError = trigger("fadeInError", [
  transition(":enter", [
    style({ opacity: 0 }),
    animate(
      "750ms ease-in-out",
      style({ opacity: 1 })
    )
  ])
])

export const fadeOut = [
  /* FadeIn */
  trigger('fadeOut', [
    transition('* => void', [
      style({
        opacity: '1',
      }),
      animate('1000ms ease')
    ]),
  ]),
]

export const slideDownHideUp = trigger("slideDownHideUp", [
  transition(":enter", [
    style({ opacity: 0, transform: "translateY(-100%)" }), //apply default styles before animation starts
    animate(
      "250ms ease-in",
      style({ opacity: 1, transform: "translateX(0)" })
    )
  ]),
  transition(":leave", [
    style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
    animate(
      "250ms ease-out",
      style({ opacity: 0, transform: "translateY(-100%)" })
    )
  ])
])


export const allCustomAnimations = [
  slideIn, 
  fadeIn,
  slideDownHideUp
]
    