
// Next
import {NextPage} from 'next'

// ** Config
import { PERMISSIONS } from 'src/configs/permission'
// ** views
import ReviewListPage from 'src/views/pages/manage-order/reviews/ReviewList'

type TProps = {}

 const Reviews:NextPage<TProps>=()=> {

  return <ReviewListPage />
}

export default Reviews


