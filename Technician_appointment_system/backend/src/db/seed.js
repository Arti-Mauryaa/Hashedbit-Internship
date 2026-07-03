const db = require('./database');

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const sample = [
  {
    technician_name: 'Rahul Verma',
    customer_name: 'Anita Sharma',
    service_type: 'AC Repair',
    appointment_date: addDays(1),
    appointment_time: '10:30',
    location: '12 MG Road, Lucknow',
    issue_description: 'AC not cooling, possible gas leak.',
    status: 'Scheduled',
    service_charge: 899.0,
  },
  {
    technician_name: 'Sanjay Gupta',
    customer_name: 'Vikram Singh',
    service_type: 'Plumbing',
    appointment_date: addDays(2),
    appointment_time: '14:00',
    location: '45 Hazratganj, Lucknow',
    issue_description: 'Leaking kitchen sink pipe.',
    status: 'Scheduled',
    service_charge: 450.5,
  },
  {
    technician_name: 'Rahul Verma',
    customer_name: 'Priya Nair',
    service_type: 'Electrical Wiring',
    appointment_date: addDays(0),
    appointment_time: '09:00',
    location: '7 Alambagh, Lucknow',
    issue_description: 'Short circuit in living room.',
    status: 'In Progress',
    service_charge: 1200.0,
  },
  {
    technician_name: 'Deepak Yadav',
    customer_name: 'Meena Kumari',
    service_type: 'Appliance Installation',
    appointment_date: addDays(-3),
    appointment_time: '11:15',
    location: '22 Gomti Nagar, Lucknow',
    issue_description: 'Install new washing machine.',
    status: 'Completed',
    service_charge: 300.0,
  },
];

const insert = db.prepare(`
  INSERT INTO technician_appointment
    (technician_name, customer_name, service_type, appointment_date, appointment_time,
     location, issue_description, status, service_charge)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

db.exec('BEGIN');
try {
  for (const row of sample) {
    insert.run(
      row.technician_name,
      row.customer_name,
      row.service_type,
      row.appointment_date,
      row.appointment_time,
      row.location,
      row.issue_description,
      row.status,
      row.service_charge
    );
  }
  db.exec('COMMIT');
  console.log(`Seeded ${sample.length} sample appointments.`);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('Seeding failed:', err);
  process.exit(1);
}
