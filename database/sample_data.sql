USE moto_income;

INSERT INTO drivers (driver_name, phone_number, motorcycle_plate, national_id, address) VALUES
('Jean Niyonsaba', '+250788100001', 'RAA 123M', '119988000001', 'Kigali'),
('Eric Tuyisenge', '+250788100002', 'RAB 456M', '119988000002', 'Musanze'),
('Patrick Habimana', '+250788100003', 'RAC 789M', '119988000003', 'Huye')
ON DUPLICATE KEY UPDATE driver_name = VALUES(driver_name);

INSERT INTO income_records (driver_id, amount, notes, payment_date, payment_time)
SELECT id, 5000, 'Morning collection', CURDATE(), '09:00:00' FROM drivers WHERE motorcycle_plate = 'RAA 123M'
UNION ALL
SELECT id, 4500, 'Afternoon collection', CURDATE(), '15:30:00' FROM drivers WHERE motorcycle_plate = 'RAB 456M'
UNION ALL
SELECT id, 6000, 'Weekly balance', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '17:45:00' FROM drivers WHERE motorcycle_plate = 'RAC 789M';
