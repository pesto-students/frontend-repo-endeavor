import { menuDetails } from './menuDetails';

export const userTypeToPageMenuOptions = {
    consumer: {
        Dashboard: [menuDetails.exit],
        DetailPage: [/*menuDetails.back*/],
    },
    business: {
        Dashboard: [menuDetails.add, menuDetails.exit],
        BusinessNewOrEdit: [menuDetails.save, menuDetails.delete, menuDetails.exit],
    },
    common: {
        Home: [],
        SignUp: [menuDetails.exit, /*menuDetails.next*/],
    },
};