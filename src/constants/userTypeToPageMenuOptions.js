import { menuDetails } from './menuDetails';

export const userTypeToPageMenuOptions = {
    consumer: {
        Dashboard: [menuDetails.exit],
        DetailPage: [/*menuDetails.back*/],
    },
    business: {
        Dashboard: [menuDetails.add, menuDetails.exit],
        DetailPageNewEntry: [menuDetails.save, /*menuDetails.back*/],
        DetailPage: [menuDetails.save, menuDetails.delete, menuDetails.exit],
    },
    common: {
        Home: [],
        SignUp: [menuDetails.exit, /*menuDetails.next*/],
    },
};