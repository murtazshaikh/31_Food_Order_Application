import React, { useContext, Fragment, useState } from "react";

import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doneSubmitting, setDonesubmitting] = useState(false);

  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.item.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItme(id);
  };
  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const checkoutHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    const response = await fetch(
      "https://food-order-app-b3679-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        //we dont just want to send userData but user choosen cart data as well to the server
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.item,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    const data = await response.json();
    console.log(data);

    setIsSubmitting(false);
    setDonesubmitting(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.item.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)} // here i am passing second argument for function that will later
          // execute
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={checkoutHandler}>
          Order
        </button>
      )}
    </div>
  );

  if (isSubmitting) {
    return (
      <Modal>
        <p>Sending order...</p>
      </Modal>
    );
  }

  if (doneSubmitting) {
    return (
      <Modal onClose={props.onClose}>
        <Fragment>
          <p>Order Submitted Succesfully.</p>
          <div className={classes.actions}>
            <button className={classes.button} onClick={props.onClose}>
              Close
            </button>
          </div>
        </Fragment>
      </Modal>
    );
  }

  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {/* <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
        {hasItems && <button className={classes.button}>Order</button>}
      </div> */}
       {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </Modal>
  );
};

export default Cart;
