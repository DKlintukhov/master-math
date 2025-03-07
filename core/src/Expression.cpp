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

namespace Core
{
    Json ToJson(const Expression& expr)
    {
        return std::visit([](const auto& e) { return e.ToJson(); }, expr);
    }

    double Evaluate(const Expression& expr)
    {
        return std::visit([](const auto& e) { return e.Evaluate(); }, expr);
    }

    Expression ExpressionFromJson(const Json& json)
    {
        auto type = json.at("type").as_string();
        if (type == "constant")
        {
            return Constant::FromJson(json);
        }
        else if (type == "binary")
        {
            return BinaryOperation::FromJson(json);
        }
        else
        {
            throw std::runtime_error("Unknown type: " + std::string(type));
        }
    }

    Constant::Constant(double val) : m_value(val) {}

    Constant Constant::FromJson(const Json& json)
    {
        if (json.at("type").as_string() != "constant")
        {
            throw std::runtime_error("Invalid type: expected 'constant'");
        }

        double value = json.at("value").as_double();
        return Constant(value);
    }

    double Constant::Evaluate() const
    {
        return m_value;
    }

    BinaryOperation::BinaryOperation(
        Operation op,
        Expression left,
        Expression right
    )
        : m_op(op)
        , m_left(std::make_unique<Expression>(std::move(left)))
        , m_right(std::make_unique<Expression>(std::move(right)))
    {
    }

    BinaryOperation BinaryOperation::FromJson(const Json& json)
    {
        if (json.at("type").as_string() != "binary")
        {
            throw std::runtime_error("Invalid type: expected 'binary'");
        }

        Operation op = static_cast<Operation>(json.at("op").as_int64());
        Expression left = ExpressionFromJson(json.at("left").as_object());
        Expression right = ExpressionFromJson(json.at("right").as_object());
        return BinaryOperation(op, std::move(left), std::move(right));
    }

    double BinaryOperation::Evaluate() const
    {
        const double left = std::visit([](const auto& e) { return e.Evaluate(); }, *m_left);
        const double right = std::visit([](const auto& e) { return e.Evaluate(); }, *m_right);
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

    Json BinaryOperation::ToJson() const
    {
        Json json;
        json["type"] = "binary";
        json["op"] = static_cast<int>(m_op);
        json["left"] = std::visit([](const auto& e) { return e.ToJson(); }, *m_left);
        json["right"] = std::visit([](const auto& e) { return e.ToJson(); }, *m_right);
        return json;
    }

    Json Constant::ToJson() const
    {
        Json json;
        json["type"] = "constant";
        json["value"] = m_value;
        return json;
    }
}
