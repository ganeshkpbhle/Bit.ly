import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { BeatLoader } from "react-spinners";
import { useAuth } from '../context/Auth';
function EmailVfc() {
    const { Id } = useParams();
    const { getUserSimple, vfcApi } = useAuth();
    const [flg, setFlg] = useState(false);
    useEffect(() => {
        const mthd = () => {
            getUserSimple(Id)
            .then((response) => {
                if (response?.data.emailVerified === 0) {
                    setFlg(true);
                    vfcApi(parseInt(Id))
                        .then((result) => {
                            if (result?.data.emailvfc) {
                                setFlg(false);
                            }
                        });
                }
            });
        }
        return mthd();
    }, []);
    return (
        <>
            {flg &&
                <div>
                    <BeatLoader loading size={35} />
                </div>
            }
            {!flg &&
                <div>
                    <p className=''>Your Email has verified you can close the tab now!</p>
                </div>
            }
        </>
    );
}

export default EmailVfc;