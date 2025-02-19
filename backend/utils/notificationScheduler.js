const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

const getTimeCategory = (hours) => {
  if (hours >= 5 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 17) return 'afternoon';
  return 'evening';
};

const checkAndCreateNotifications = async () => {
  try {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    console.log(`[Notification Check] ${now.toISOString()} - Current time: ${currentTime}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activePrescriptions = await Prescription.find({ 
      completed: false 
    }).populate('patientId');

    for (const prescription of activePrescriptions) {
      for (const medicine of prescription.medicines) {
        const times = medicine.timeToTake.split(',').map(t => t.trim());
        
        for (const time of times) {
          if (time === currentTime) {
            const [hours] = time.split(':').map(Number);
            const timeCategory = getTimeCategory(hours);
            const timingId = `${prescription._id}-${medicine.drugName}-${time}`;

            // Check for existing notification
            const existingNotification = await Notification.findOne({
              userId: prescription.patientId._id,
              'data.timingId': timingId,
              'data.date': {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
              }
            });

            if (!existingNotification) {
              console.log(`Creating notification for ${medicine.drugName} at ${time}`);
              
              await Notification.create({
                userId: prescription.patientId._id,
                message: `Time to take ${medicine.drugName} (${medicine.dosage}) - ${medicine.whenToTake}`,
                type: 'reminder',
                scheduledTime: time,
                timeCategory,
                data: {
                  prescriptionId: prescription._id,
                  drugName: medicine.drugName,
                  dosage: medicine.dosage,
                  whenToTake: medicine.whenToTake,
                  timingId,
                  date: new Date()
                }
              });

              console.log(`Notification created for ${prescription.patientId.name} - ${medicine.drugName}`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in notification scheduler:', err);
  }
};

module.exports = { checkAndCreateNotifications };
