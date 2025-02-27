/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#include "pch.h"

#include "Expression.h"
#include <numeric>

namespace Core
{

    Constant::Constant(double val) : m_value(val) {}

    double Constant::Evaluate() const
    {
        return m_value;
    }

    BinaryExpression::BinaryExpression(
        std::unique_ptr<Expression> left,
        std::unique_ptr<Expression> right,
        Operation op
    )
        : m_left(std::move(left))
        , m_right(std::move(right))
        , m_op(op)
    {
    }

    double BinaryExpression::Evaluate() const
    {
        const double left = m_left->Evaluate();
        const double right = m_right->Evaluate();
        switch (m_op)
        {
        case Operation::Add: return left + right;
        case Operation::Sub: return left - right;
        case Operation::Mul: return left * right;
        case Operation::Div:
            if (right == 0.0)
            {
                throw std::runtime_error("Division by 0");
            }
            return left / right;
        default:
            throw std::runtime_error("Invalid Operation");
        }
    }

    boost::json::object BinaryExpression::ToJson() const
    {
        boost::json::object obj;
        obj["type"] = "binary";
        obj["op"] = static_cast<int>(m_op);
        obj["left"] = m_left->ToJson();
        obj["right"] = m_right->ToJson();
        return obj;
    }

    boost::json::object Constant::ToJson() const
    {
        boost::json::object obj;
        obj["type"] = "constant";
        obj["value"] = m_value;
        return obj;
    }
}
