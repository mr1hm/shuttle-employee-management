getOperatorsData()
$operatorUserDetails = [
  'user_id': [
    'user_id',
    'last_name,
    'first_name,
    'special_route_ok,
    'total_weekly_minutes,
    'assignment_details': [
      'Sun': [
        'available_times': [
          start,
          end
        ],
        'times_assigned': [

        ],
        'continuous_minutes_assinged',
        'total_daily_minutes'
      ],
      'Mon':[],
      ...
    ]
  ]
]

$operatorAvailability = [
  'user_id',
  day_of_week,
  availability
]
after array_group_by
$operatorAvailablity = [
  user_id: [
    user_id,
    day_of_week,
    availability
  ]
]
